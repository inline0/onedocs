import * as Clock from "effect/Clock"
import * as Context from "effect/Context"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import {
  type CallOptions,
  CallTimeout,
  decorate,
  describeCall,
  type GatewayDefinition,
  type Middleware,
} from "./gateway.ts"

export interface DryRunEntry {
  readonly gateway: string
  readonly description: string
}

export class DryRun extends Context.Service<
  DryRun,
  {
    readonly enabled: boolean
    readonly record: (entry: DryRunEntry) => Effect.Effect<void>
    readonly entries: Effect.Effect<ReadonlyArray<DryRunEntry>>
  }
>()("onedocs/scripts/DryRun") {
  static readonly layer = (enabled: boolean) =>
    Layer.effect(
      DryRun,
      Effect.gen(function* () {
        const journal = yield* Ref.make<ReadonlyArray<DryRunEntry>>([])
        return {
          enabled,
          record: (entry: DryRunEntry) =>
            Ref.update(journal, (entries) => [...entries, entry]),
          entries: Ref.get(journal),
        }
      })
    )
}

export const policy: Middleware = <Id, Call extends CallOptions, Result, Error>(
  definition: GatewayDefinition<Id, Call, Result, Error>
) =>
  decorate(definition, (next) =>
    Effect.succeed((call: Call) => {
      let effect = next(call)
      if (call.timeout !== undefined) {
        const description = describeCall(definition.kind, call)
        const timeout = Duration.format(Duration.fromInputUnsafe(call.timeout))
        effect = Effect.timeoutOrElse(effect, {
          duration: call.timeout,
          orElse: () =>
            Effect.fail(
              new CallTimeout({
                gateway: definition.kind.name,
                description,
                timeout,
                message: `${description} timed out after ${timeout}`,
              }) as Error
            ),
        })
      }
      if (call.retry !== undefined) {
        const retryWhile = call.retryWhile
        effect = Effect.retry(effect, {
          schedule: call.retry,
          ...(retryWhile === undefined
            ? {}
            : { while: (error: Error) => retryWhile(error) }),
        })
      }
      return effect
    })
  )

export const dryRun: Middleware<DryRun> = <
  Id,
  Call extends CallOptions,
  Result,
  Error,
>(
  definition: GatewayDefinition<Id, Call, Result, Error>
) =>
  decorate(definition, (next) =>
    Effect.map(DryRun, (journal) => (call: Call) => {
      if (!journal.enabled || !definition.kind.mutates(call)) {
        return next(call)
      }
      const description = describeCall(definition.kind, call)
      return journal
        .record({ gateway: definition.kind.name, description })
        .pipe(
          Effect.andThen(Effect.logInfo(`dry-run: ${description}`)),
          Effect.as(definition.kind.dryRunResult(call))
        )
    })
  )

export const trace: Middleware = <Id, Call extends CallOptions, Result, Error>(
  definition: GatewayDefinition<Id, Call, Result, Error>
) =>
  decorate(definition, (next) =>
    Effect.succeed((call: Call) => {
      const description = describeCall(definition.kind, call)
      return Effect.gen(function* () {
        const started = yield* Clock.currentTimeMillis
        const exit = yield* Effect.exit(next(call))
        const elapsed = (yield* Clock.currentTimeMillis) - started
        yield* Effect.logDebug(
          `${definition.kind.name}: ${description} ${Exit.isSuccess(exit) ? "ok" : "failed"} in ${elapsed}ms`
        )
        return yield* exit
      }).pipe(
        Effect.withSpan(`${definition.kind.name}.run`, {
          attributes: { call: description },
        })
      )
    })
  )

// The policy wraps the live call so a retry repeats only the real call, a
// recorded dry-run call is never retried, and trace sees every call.
export const standardMiddleware = [policy, dryRun, trace] as const
