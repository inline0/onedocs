import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Layer from "effect/Layer"
import * as Command from "./command.ts"
import { withMiddleware } from "./gateway.ts"
import * as Log from "./log.ts"
import { DryRun, standardMiddleware } from "./middleware.ts"

export interface RuntimeOptions {
  readonly dryRun: boolean
  readonly logFormat: Log.LogFormat
}

export const runtimeLayer = (options: RuntimeOptions) =>
  withMiddleware(Command.definition, Command.layer, standardMiddleware).pipe(
    Layer.provideMerge(DryRun.layer(options.dryRun)),
    Layer.provideMerge(NodeServices.layer),
    Layer.provideMerge(Log.layer({ format: options.logFormat }))
  )

export type RuntimeServices = Layer.Success<ReturnType<typeof runtimeLayer>>
