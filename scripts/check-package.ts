import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFile } from "node:fs/promises"

interface PackedFile {
  path: string
}

interface PackedPackage {
  filename: string
  files: PackedFile[]
}

const manifest = JSON.parse(
  await readFile(
    new URL("../packages/onedocs/package.json", import.meta.url),
    "utf8"
  )
) as { exports: Record<string, string | Record<string, string>> }
const packed = JSON.parse(
  execFileSync("pnpm", ["pack", "--dry-run", "--json"], {
    cwd: new URL("../packages/onedocs", import.meta.url),
    encoding: "utf8",
  })
) as PackedPackage
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
  const content = await readFile(
    new URL(`../packages/onedocs/${relativePath}`, import.meta.url)
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
    const content = await readFile(
      new URL(`../packages/onedocs/${path}`, import.meta.url),
      "utf8"
    )
    for (const match of content.matchAll(/\bfrom\s+["'](\.[^"']+)["']/g)) {
      assert(
        /\.js$/.test(match[1] ?? ""),
        `Unresolved relative module in ${path}: ${match[1]}`
      )
    }
  }
}
console.log(
  `Validated ${packed.filename}: all ${Object.keys(manifest.exports).length} exports, declarations, CSS, README and license.`
)
