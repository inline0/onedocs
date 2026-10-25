import { join } from "node:path"
import { fileURLToPath } from "node:url"
import * as Flag from "effect/cli/Flag"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { emit, main, script } from "./lib/cli.ts"

export const rewrite = (source: string) =>
  source.replace(
    /\b(from\s+|import\s*\(\s*)(["'])(\.[^"']+)\.tsx?\2/g,
    "$1$2$3.js$2"
  )
export const command = script("prepare-declarations", {
  description:
    "Point emitted declaration imports at the published JavaScript files.",
  flags: {
    directory: Flag.String("directory").pipe(
      Flag.withDefault(
        fileURLToPath(new URL("../packages/onedocs/dist/", import.meta.url))
      )
    ),
  },
  run: (input) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      let changed = 0
      for (const file of yield* fs.readDirectory(input.directory, {
        recursive: true,
      })) {
        if (!file.endsWith(".d.ts")) continue
        const path = join(input.directory, file)
        const source = yield* fs.readFileString(path)
        const rewritten = rewrite(source)
        if (source !== rewritten) {
          if (!input.dryRun) yield* fs.writeFileString(path, rewritten)
          changed += 1
        }
      }
      if (input.json || input.dryRun)
        yield* emit(
          input,
          { changed, dryRun: input.dryRun },
          (value) =>
            `${value.dryRun ? "Would update" : "Updated"} ${value.changed} declaration files.`
        )
    }),
})
if (import.meta.main) main(command)
