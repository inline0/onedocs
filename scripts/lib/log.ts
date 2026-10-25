// Logs go to stderr because stdout carries only a script's result, which
// other tools parse.

import * as Cause from "effect/Cause"
import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"
import type * as LogLevel from "effect/LogLevel"
import * as References from "effect/References"
import { Secrets } from "./secrets.ts"

export type LogFormat = "text" | "json"

export interface LogEntry {
  readonly level: string
  readonly message: string
  readonly spans: Readonly<Record<string, number>>
  readonly annotations: Readonly<Record<string, unknown>>
  readonly cause?: string
}

const render = (value: unknown): string => {
  if (typeof value === "string") {
    return value
  }
  if (value instanceof Error) {
    return value.message
  }
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

export const formatEntry = (entry: LogEntry, format: LogFormat): string => {
  if (format === "json") {
    return JSON.stringify({
      level: entry.level,
      message: entry.message,
      ...(Object.keys(entry.spans).length > 0 ? { spans: entry.spans } : {}),
      ...(Object.keys(entry.annotations).length > 0
        ? { annotations: entry.annotations }
        : {}),
      ...(entry.cause === undefined ? {} : { cause: entry.cause }),
    })
  }
  const prefix = entry.level === "info" ? "" : `${entry.level}: `
  const extras = [
    ...Object.entries(entry.spans).map(([name, ms]) => `${name}=${ms}ms`),
    ...Object.entries(entry.annotations).map(
      ([key, value]) => `${key}=${render(value)}`
    ),
  ]
  const suffix = extras.length > 0 ? ` (${extras.join(" ")})` : ""
  const cause = entry.cause === undefined ? "" : `\n${entry.cause}`
  return `${prefix}${entry.message}${suffix}${cause}`
}

const makeLogger = (
  format: LogFormat,
  write: (line: string) => void = (line) => process.stderr.write(`${line}\n`)
) =>
  Logger.make((options) => {
    const now = options.date.getTime()
    const spans: Record<string, number> = {}
    for (const [name, started] of options.fiber.getRef(
      References.CurrentLogSpans
    )) {
      spans[name] = now - started
    }
    const messages: ReadonlyArray<unknown> = [options.message].flat()
    const entry: LogEntry = {
      level: options.logLevel.toLowerCase(),
      message: messages.map(render).join(" "),
      spans,
      annotations: options.fiber.getRef(References.CurrentLogAnnotations),
      ...(options.cause.reasons.length > 0
        ? { cause: Cause.pretty(options.cause) }
        : {}),
    }
    write(options.fiber.getRef(Secrets).redact(formatEntry(entry, format)))
  })

export const layer = (options: {
  readonly format: LogFormat
  readonly write?: (line: string) => void
}) => Logger.layer([makeLogger(options.format, options.write)])

export const minimumLevel = (level: LogLevel.LogLevel) =>
  Layer.succeed(References.MinimumLogLevel, level)

// A tracing span, a log span on every line logged inside, and one line with
// the duration when it ends.
export const step =
  (name: string, options: { readonly level?: LogLevel.Severity } = {}) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
    Effect.gen(function* () {
      const started = yield* Clock.currentTimeMillis
      const exit = yield* Effect.exit(effect.pipe(Effect.withLogSpan(name)))
      const elapsed = (yield* Clock.currentTimeMillis) - started
      const outcome = Exit.isSuccess(exit) ? "done" : "failed"
      yield* Effect.logWithLevel(options.level ?? "Info")(
        `${name} ${outcome} in ${elapsed}ms`
      )
      return yield* exit
    }).pipe(Effect.withSpan(name))
