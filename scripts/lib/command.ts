// Built on effect/process, so an interrupted or timed-out call kills the
// child with its scope.

import * as Context from "effect/Context"
import * as Data from "effect/Data"
import type * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as ChildProcess from "effect/process/ChildProcess"
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner"
import * as Stream from "effect/Stream"
import type { CallOptions, CallTimeout, GatewayKind } from "./gateway.ts"

export interface CommandCall extends CallOptions {
  readonly command: string
  readonly args?: ReadonlyArray<string>
  readonly cwd?: string
  // Merged over the inherited environment.
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly stdin?: string | Uint8Array
  // check: false returns any exit code instead of failing outside
  // okExitCodes ([0] by default).
  readonly check?: boolean
  readonly okExitCodes?: ReadonlyArray<number>
  readonly onLine?: (
    line: string,
    stream: "stdout" | "stderr"
  ) => Effect.Effect<void>
  readonly killAfter?: Duration.Input
  // Connects the child to this process's streams the way a shell's exec
  // would, so a terminal stays a terminal; nothing is captured.
  readonly inherit?: boolean
}

export interface CommandResult {
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
  readonly stdoutBytes: Uint8Array
}

export class CommandError extends Data.TaggedError("CommandError")<{
  readonly command: string
  readonly message: string
  readonly cause?: unknown
}> {}

export class CommandFailed extends Data.TaggedError("CommandFailed")<{
  readonly command: string
  readonly exitCode: number
  readonly stderr: string
  readonly message: string
}> {}

export type CommandErrors = CommandError | CommandFailed | CallTimeout

const quoteArgument = (value: string) =>
  /^[\w@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`

export const commandLine = (call: Pick<CommandCall, "command" | "args">) =>
  [call.command, ...(call.args ?? [])].map(quoteArgument).join(" ")

const tail = (text: string, lines = 20) =>
  text.trimEnd().split("\n").slice(-lines).join("\n")

export const commandFailed = (call: CommandCall, result: CommandResult) => {
  const stderr = tail(result.stderr)
  return new CommandFailed({
    command: commandLine(call),
    exitCode: result.exitCode,
    stderr,
    message: `${commandLine(call)} exited with ${result.exitCode}${stderr === "" ? "" : `:\n${stderr}`}`,
  })
}

export const checkExit = (
  call: CommandCall,
  result: CommandResult
): Effect.Effect<CommandResult, CommandFailed> =>
  call.check === false || (call.okExitCodes ?? [0]).includes(result.exitCode)
    ? Effect.succeed(result)
    : Effect.fail(commandFailed(call, result))

export const emptyResult = (exitCode = 0): CommandResult => ({
  exitCode,
  stdout: "",
  stderr: "",
  stdoutBytes: new Uint8Array(),
})

export const commandKind: GatewayKind<CommandCall, CommandResult> = {
  name: "command",
  describe: commandLine,
  mutates: (call) => call.mutates ?? true,
  dryRunResult: () => emptyResult(),
}

export class Command extends Context.Service<
  Command,
  {
    readonly run: (
      call: CommandCall
    ) => Effect.Effect<CommandResult, CommandErrors>
  }
>()("onedocs/scripts/Command") {}

export const definition = { key: Command, kind: commandKind }

const concat = (chunks: ReadonlyArray<Uint8Array>) => {
  const bytes = new Uint8Array(
    chunks.reduce((total, chunk) => total + chunk.length, 0)
  )
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return bytes
}

const collect = <E>(
  stream: Stream.Stream<Uint8Array, E>,
  onLine: ((line: string) => Effect.Effect<void>) | undefined
) =>
  Effect.gen(function* () {
    const chunks: Array<Uint8Array> = []
    const decoder = new TextDecoder()
    let pending = ""
    yield* Stream.runForEach(stream, (chunk) =>
      Effect.gen(function* () {
        chunks.push(chunk)
        if (onLine === undefined) {
          return
        }
        pending += decoder.decode(chunk, { stream: true })
        const end = pending.lastIndexOf("\n")
        if (end === -1) {
          return
        }
        const complete = pending.slice(0, end)
        pending = pending.slice(end + 1)
        for (const line of complete.split("\n")) {
          yield* onLine(line)
        }
      })
    )
    if (onLine !== undefined) {
      pending += decoder.decode()
      if (pending !== "") {
        yield* onLine(pending)
      }
    }
    return concat(chunks)
  })

const options = (call: CommandCall) => ({
  ...(call.cwd === undefined ? {} : { cwd: call.cwd }),
  ...(call.env === undefined ? {} : { env: { ...call.env } }),
  extendEnv: true,
})

const decoder = new TextDecoder()

export const layer = Layer.effect(
  Command,
  Effect.gen(function* () {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
    const run = (call: CommandCall) =>
      Effect.scoped(
        Effect.gen(function* () {
          if (call.inherit === true) {
            const child = yield* spawner.spawn(
              ChildProcess.make(call.command, [...(call.args ?? [])], {
                ...options(call),
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit",
                detached: false,
              })
            )
            return emptyResult(Number(yield* child.exitCode))
          }
          const handle = yield* spawner.spawn(
            ChildProcess.make(call.command, [...(call.args ?? [])], {
              ...options(call),
              stdin:
                call.stdin === undefined
                  ? ("ignore" as const)
                  : Stream.make(
                      typeof call.stdin === "string"
                        ? new TextEncoder().encode(call.stdin)
                        : call.stdin
                    ),
              ...(call.killAfter === undefined
                ? {}
                : { forceKillAfter: call.killAfter }),
            })
          )
          const onLine = call.onLine
          const [stdout, stderr, exitCode] = yield* Effect.all(
            [
              collect(
                handle.stdout,
                onLine && ((line) => onLine(line, "stdout"))
              ),
              collect(
                handle.stderr,
                onLine && ((line) => onLine(line, "stderr"))
              ),
              handle.exitCode,
            ],
            { concurrency: "unbounded" }
          )
          return {
            exitCode: Number(exitCode),
            stdout: decoder.decode(stdout),
            stderr: decoder.decode(stderr),
            stdoutBytes: stdout,
          }
        })
      ).pipe(
        Effect.mapError(
          (cause) =>
            new CommandError({
              command: commandLine(call),
              message: `${commandLine(call)} could not run: ${cause.message}`,
              cause,
            })
        ),
        Effect.flatMap((result) => checkExit(call, result))
      )
    return { run }
  })
)

export const run = (call: CommandCall) =>
  Command.use((command) => command.run(call))

export const text = (call: CommandCall) =>
  Effect.map(run(call), (result) => result.stdout)

export const lines = (call: CommandCall) =>
  Effect.map(run(call), (result) =>
    result.stdout.split("\n").filter((line) => line.trim() !== "")
  )
