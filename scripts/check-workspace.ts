import assert from "node:assert/strict"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import * as Flag from "effect/cli/Flag"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { parse } from "yaml"
import { emit, main, script } from "./lib/cli.ts"
import { attempt, readJson } from "./lib/files.ts"

interface Manifest {
  name: string
  description?: string
  private?: boolean
  type?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

export const run = (root: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const source = yield* fs.readFileString(join(root, "pnpm-workspace.yaml"))
    const workspace = yield* attempt(
      () => parse(source) as { catalog: Record<string, string> }
    )
    const rootManifest = yield* readJson<Manifest>(join(root, "package.json"))
    const folders = yield* fs.readDirectory(join(root, "packages"))
    const packages: { folder: string; manifest: Manifest }[] = []
    for (const folder of folders) {
      const directory = join(root, "packages", folder)
      if ((yield* fs.stat(directory)).type !== "Directory") continue
      const manifest = yield* readJson<Manifest>(
        join(directory, "package.json")
      )
      yield* fs.readFileString(join(directory, "README.md"))
      packages.push({ folder, manifest })
    }
    const readme = yield* fs.readFileString(join(root, "README.md"))
    yield* attempt(() => {
      const names = new Set(packages.map(({ manifest }) => manifest.name))
      assert.equal(
        names.size,
        packages.length,
        "Workspace package names must be unique"
      )
      for (const { folder, manifest } of packages) {
        assert.equal(
          manifest.type,
          "module",
          `${manifest.name} must use ES modules`
        )
        assert(
          manifest.name === "onedocs" || manifest.private === true,
          `${manifest.name} must stay private`
        )
        assert(manifest.description, `${manifest.name} needs a description`)
        const row = `| [${manifest.name}](packages/${folder}/README.md) | ${manifest.description} |`
        const rows = readme.split("\n").map((line) =>
          line
            .split("|")
            .map((cell) => cell.trim())
            .join(" | ")
            .trim()
        )
        assert.equal(
          rows.filter((line) => line === row).length,
          1,
          `${manifest.name} must appear exactly once in the README package table`
        )
      }
      for (const manifest of [
        rootManifest,
        ...packages.map((item) => item.manifest),
      ]) {
        for (const group of [
          manifest.dependencies,
          manifest.devDependencies,
          manifest.optionalDependencies,
        ]) {
          for (const [name, version] of Object.entries(group ?? {})) {
            if (names.has(name)) {
              assert.equal(
                version,
                "workspace:*",
                `${manifest.name}: ${name} must use workspace:*`
              )
            } else {
              assert.equal(
                version,
                "catalog:",
                `${manifest.name}: ${name} must use catalog:`
              )
              assert(
                workspace.catalog[name],
                `${name} is missing from the catalog`
              )
            }
          }
        }
      }
    })
    return { packages: packages.length }
  })
export const command = script("check-workspace", {
  description:
    "Validate workspace manifests, package READMEs and dependency catalogs.",
  flags: {
    root: Flag.String("root").pipe(
      Flag.withDefault(fileURLToPath(new URL("../", import.meta.url)))
    ),
  },
  run: (input) =>
    Effect.gen(function* () {
      const result = yield* run(input.root)
      yield* emit(
        input,
        result,
        (value) =>
          `Validated ${value.packages} workspace packages and their dependency catalogs.`
      )
    }),
})
if (import.meta.main) main(command)
