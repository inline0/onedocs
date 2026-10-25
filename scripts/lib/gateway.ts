// A gateway is the only way a script reaches the world. Each one is a service
// with a single `run(call)` method taking a plain call description, so
// dry-run, tracing, timeouts and retries are written once as middleware and
// stacked over any gateway, and tests replace the live layer with stubs.

import type * as Context from "effect/Context"
import * as Data from "effect/Data"
import type * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type * as Schedule from "effect/Schedule"

export interface CallOptions {
  readonly label?: string
  // Dry-run lets a call through only when this is false; each gateway
  // decides the default for calls that leave it unset.
  readonly mutates?: boolean
  readonly timeout?: Duration.Input
  readonly retry?: Schedule.Schedule<unknown, unknown>
  readonly retryWhile?: (error: unknown) => boolean
}

export interface Gateway<Call extends CallOptions, Result, Error> {
  readonly run: (call: Call) => Effect.Effect<Result, Error>
}

export interface GatewayKind<Call extends CallOptions, Result> {
  readonly name: string
  readonly describe: (call: Call) => string
  readonly mutates: (call: Call) => boolean
  readonly dryRunResult: (call: Call) => Result
}

export interface GatewayDefinition<
  Id,
  Call extends CallOptions,
  Result,
  Error,
> {
  readonly key: Context.Key<Id, Gateway<Call, Result, Error>>
  readonly kind: GatewayKind<Call, Result>
}

export class CallTimeout extends Data.TaggedError("CallTimeout")<{
  readonly gateway: string
  readonly description: string
  readonly timeout: string
  readonly message: string
}> {}

export const describeCall = <Call extends CallOptions, Result>(
  kind: GatewayKind<Call, Result>,
  call: Call
) => call.label ?? kind.describe(call)

export const decorate = <Id, Call extends CallOptions, Result, Error, Deps>(
  definition: GatewayDefinition<Id, Call, Result, Error>,
  wrap: (
    next: Gateway<Call, Result, Error>["run"]
  ) => Effect.Effect<Gateway<Call, Result, Error>["run"], never, Deps>
): Layer.Layer<Id, never, Id | Deps> =>
  Layer.effect(
    definition.key,
    Effect.gen(function* () {
      const inner = yield* definition.key
      const run = yield* wrap(inner.run)
      return { ...inner, run }
    })
  )

export type Middleware<Deps = never> = <
  Id,
  Call extends CallOptions,
  Result,
  Error,
>(
  definition: GatewayDefinition<Id, Call, Result, Error>
) => Layer.Layer<Id, never, Id | Deps>

// Innermost first: withMiddleware(def, live, [policy, dryRun, trace])
// answers a call through trace, then dryRun, then policy, then live.
export const withMiddleware = <
  Id,
  Call extends CallOptions,
  Result,
  Error,
  E,
  R,
  Deps,
>(
  definition: GatewayDefinition<Id, Call, Result, Error>,
  live: Layer.Layer<Id, E, R>,
  middleware: ReadonlyArray<Middleware<Deps>>
): Layer.Layer<Id, E, R | Deps> =>
  middleware.reduce<Layer.Layer<Id, E, R | Deps>>(
    (inner, decorator) => Layer.provide(decorator(definition), inner),
    live
  )
