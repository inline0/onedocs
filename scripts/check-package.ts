import assert from "node:assert/strict"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { emit, main, script } from "./lib/cli.ts"
import * as Command from "./lib/command.ts"
import { attempt, readJson } from "./lib/files.ts"

interface PackedFile {
  path: string
}

interface PackedPackage {
  filename: string
  files: PackedFile[]
}

export const run = (root: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const manifest = yield* readJson<{
      exports: Record<string, string | Record<string, string>>
    }>(join(root, "packages/onedocs/package.json"))
    const packedSource = yield* Command.text({
      command: "pnpm",
      args: ["pack", "--dry-run", "--json"],
      cwd: join(root, "packages/onedocs"),
      timeout: "1 minute",
    })
    const packed = yield* attempt(
      () => JSON.parse(packedSource) as PackedPackage
    )
    assert(packed.filename, "pnpm pack must produce a package")
    const paths = new Set(packed.files.map((file) => file.path))
    for (const path of [
      "README.md",
      "LICENSE",
      ...Object.values(manifest.exports).flatMap((entry) =>
        typeof entry === "string" ? [entry] : Object.values(entry)
      ),
    ]) {
      const relativePath = path.replace(/^\.\//, "")
      assert(paths.has(relativePath), `Package is missing ${path}`)
      const content = yield* fs.readFile(
        join(root, "packages/onedocs", relativePath)
      )
      assert(content.byteLength > 0, `Package file is empty: ${path}`)
    }
    for (const { path } of packed.files) {
      assert(
        !path.includes("node_modules/"),
        `Package leaks installed dependencies: ${path}`
      )
      assert(!path.includes(".test."), `Package leaks a test file: ${path}`)
      assert(
        !path.startsWith("src/") || path.startsWith("src/css/"),
        `Package leaks unbuilt source: ${path}`
      )
      if (path.startsWith("dist/") && /\.(?:js|ts)$/.test(path)) {
        const content = yield* fs.readFileString(
          join(root, "packages/onedocs", path)
        )
        for (const match of content.matchAll(/\bfrom\s+["'](\.[^"']+)["']/g)) {
          assert(
            /\.js$/.test(match[1] ?? ""),
            `Unresolved relative module in ${path}: ${match[1]}`
          )
        }
      }
    }
    return {
      filename: packed.filename,
      exports: Object.keys(manifest.exports).length,
    }
  })
export const command = script("check-package", {
  description:
    "Check every packed export, declaration, stylesheet and runtime import.",
  flags: {},
  run: (input) =>
    Effect.gen(function* () {
      if (input.dryRun)
        return yield* emit(
          input,
          { planned: "Inspect the package with pnpm pack --dry-run" },
          (value) => value.planned
        )
      const result = yield* run(fileURLToPath(new URL("../", import.meta.url)))
      yield* emit(
        input,
        result,
        (value) =>
          `Validated ${value.filename}: all ${value.exports} exports, declarations, CSS, README and license.`
      )
    }),
})
if (import.meta.main) main(command)
