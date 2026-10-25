import { fileURLToPath } from "node:url"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { emit, main, script } from "./lib/cli.ts"

export const command = script("prepare-package", {
  description: "Copy the root license into the published package.",
  flags: {},
  run: (input) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      if (!input.dryRun)
        yield* fs.copyFile(
          fileURLToPath(new URL("../LICENSE", import.meta.url)),
          fileURLToPath(new URL("../packages/onedocs/LICENSE", import.meta.url))
        )
      if (input.json || input.dryRun)
        yield* emit(input, { copied: !input.dryRun, file: "LICENSE" }, () =>
          input.dryRun
            ? "Would copy LICENSE into the package."
            : "Prepared package license."
        )
    }),
})
if (import.meta.main) main(command)
