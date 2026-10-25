// Every script is `script(name, { description, flags, run })` plus
// `if (import.meta.main) main(command)`, and gets --help, --json, --dry-run
// and --log-level. Exit codes follow failures.ts: 0 success, 1 failure,
// 2 usage, a ScriptExit's own code, and 130 when interrupted.

import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Cause from "effect/Cause"
import * as CliError from "effect/cli/CliError"
import * as Cli from "effect/cli/Command"
import * as Flag from "effect/cli/Flag"
import * as Console from "effect/Console"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Runtime from "effect/Runtime"
import {
  CLI_EXIT_FAILURE,
  CLI_EXIT_SUCCESS,
  CLI_EXIT_USAGE,
  CliFailure,
} from "./failures.ts"
import { type RuntimeServices, runtimeLayer } from "./runtime.ts"
import { Secrets } from "./secrets.ts"

export const exitCodes = {
  success: CLI_EXIT_SUCCESS,
  failure: CLI_EXIT_FAILURE,
  usage: CLI_EXIT_USAGE,
  interrupted: 130,
} as const

const standardFlags = {
  json: Flag.Boolean("json").pipe(
    Flag.withDefault(false),
    Flag.withDescription(
      "Print the result as JSON on stdout and logs as JSON lines on stderr"
    )
  ),
  dryRun: Flag.Boolean("dry-run").pipe(
    Flag.withDefault(false),
    Flag.withDescription(
      "Record every call that would change something instead of making it"
    )
  ),
}

export interface ScriptInput {
  readonly json: boolean
  readonly dryRun: boolean
}

export class ScriptExit extends Data.TaggedError("ScriptExit")<{
  readonly code: number
  readonly message?: string
}> {
  override get [Runtime.errorExitCode]() {
    return this.code
  }
}

export const fail = (message: string, code: number = exitCodes.failure) =>
  Effect.fail(new ScriptExit({ code, message }))

export const insist = (
  condition: unknown,
  message: string,
  code: number = exitCodes.failure
) => (condition ? Effect.void : fail(message, code))

export const script = <
  const Name extends string,
  const Config extends Cli.Command.Config,
  E,
>(
  name: Name,
  options: {
    readonly description: string
    readonly flags: Config
    readonly run: (
      input: Cli.Command.Config.Infer<Config> & ScriptInput
    ) => Effect.Effect<void, E, RuntimeServices>
  }
) =>
  Cli.make(name, { ...options.flags, ...standardFlags }, (input) => {
    const parsed = input as Cli.Command.Config.Infer<Config> & ScriptInput
    return options.run(parsed).pipe(
      Effect.provide(
        runtimeLayer({
          dryRun: parsed.dryRun,
          logFormat: parsed.json ? "json" : "text",
        })
      )
    )
  }).pipe(Cli.withDescription(options.description))

export const emit = <A>(
  input: ScriptInput,
  value: A,
  text: (value: A) => string
) => Console.log(input.json ? JSON.stringify(value) : text(value))

const messageOf = (error: unknown): string => {
  if (error instanceof Error && error.message !== "") {
    return error.message
  }
  if (typeof error === "object" && error !== null && "_tag" in error) {
    return String(error._tag)
  }
  return String(error)
}

// Writes the reason to stderr with every registered secret redacted.
export const exitCodeOf = (cause: Cause.Cause<unknown>) =>
  Effect.gen(function* () {
    const store = yield* Secrets
    const write = (text: string) =>
      Effect.sync(() => process.stderr.write(`${store.redact(text)}\n`))
    if (Cause.hasInterruptsOnly(cause)) {
      return exitCodes.interrupted
    }
    const failure = Option.getOrUndefined(Cause.findErrorOption(cause))
    if (failure instanceof ScriptExit) {
      if (failure.message !== undefined && failure.message !== "") {
        yield* write(failure.message)
      }
      return failure.code
    }
    if (failure instanceof CliFailure) {
      yield* write(
        failure.hint === null
          ? `error: ${failure.message}`
          : `error: ${failure.message}\n${failure.hint}`
      )
      return failure.exitCode
    }
    // effect/cli has already rendered the usage error with the help.
    if (CliError.isCliError(failure)) {
      return exitCodes.usage
    }
    if (failure !== undefined) {
      yield* write(`error: ${messageOf(failure)}`)
      return Runtime.getErrorExitCode(failure)
    }
    yield* write(`error: ${Cause.pretty(cause)}`)
    return exitCodes.failure
  })

export const runArguments = <Name extends string, Input, Context, E, R>(
  command: Cli.Command<Name, Input, Context, E, R>,
  argv: ReadonlyArray<string>
) =>
  Cli.runWith(command, { version: "1" })(argv).pipe(
    Effect.as(exitCodes.success as number),
    Effect.catchCause(exitCodeOf),
    Effect.provide(NodeServices.layer)
  ) as Effect.Effect<number>

export const main = <Name extends string, Input, Context, E, R>(
  command: Cli.Command<Name, Input, Context, E, R>
) =>
  NodeRuntime.runMain(
    runArguments(command, process.argv.slice(2)).pipe(
      Effect.flatMap((code) =>
        code === exitCodes.success
          ? Effect.void
          : Effect.fail(new ScriptExit({ code }))
      )
    ),
    { disableErrorReporting: true }
  )
