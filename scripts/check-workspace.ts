import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { parse } from "yaml"

interface Manifest {
  name: string
  description?: string
  private?: boolean
  type?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

const root = new URL("../", import.meta.url)
const workspace = parse(
  await readFile(new URL("pnpm-workspace.yaml", root), "utf8")
) as {
  catalog: Record<string, string>
}
const folders = await readdir(new URL("packages/", root), {
  withFileTypes: true,
})
const packages = await Promise.all(
  folders
    .filter((folder) => folder.isDirectory())
    .map(async (folder) => ({
      folder: folder.name,
      manifest: JSON.parse(
        await readFile(
          new URL(`packages/${folder.name}/package.json`, root),
          "utf8"
        )
      ) as Manifest,
    }))
)
const names = new Set(packages.map(({ manifest }) => manifest.name))
assert.equal(
  names.size,
  packages.length,
  "Workspace package names must be unique"
)
const readme = await readFile(new URL("README.md", root), "utf8")
for (const { folder, manifest } of packages) {
  assert.equal(manifest.type, "module", `${manifest.name} must use ES modules`)
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
  await readFile(new URL(`packages/${folder}/README.md`, root))
}
const rootManifest = JSON.parse(
  await readFile(new URL("package.json", root), "utf8")
) as Manifest
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
        assert(workspace.catalog[name], `${name} is missing from the catalog`)
      }
    }
  }
}
console.log(
  `Validated ${packages.length} workspace packages and their dependency catalogs.`
)
