import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { fail } from "./cli.ts"

export const attempt = <A>(operation: () => A) =>
  Effect.try({
    try: operation,
    catch: (cause) =>
      new Error(cause instanceof Error ? cause.message : String(cause)),
  })
export const readJson = <A>(path: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const source = yield* fs.readFileString(path)
    return yield* attempt(() => JSON.parse(source) as A)
  })
export const ensure = (condition: unknown, message: string) =>
  condition ? Effect.void : fail(message)
