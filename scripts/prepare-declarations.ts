import { readFile, readdir, writeFile } from "node:fs/promises"

const directory = new URL("../packages/onedocs/dist/", import.meta.url)
const files = await readdir(directory, { recursive: true })

// TypeScript rewrites runtime imports but preserves TypeScript extensions
// in declarations. Publish references to the emitted JavaScript instead.
for (const file of files) {
  if (!file.endsWith(".d.ts")) continue
  const path = new URL(file, directory)
  const source = await readFile(path, "utf8")
  const rewritten = source.replace(
    /\b(from\s+|import\s*\(\s*)(["'])(\.[^"']+)\.tsx?\2/g,
    "$1$2$3.js$2"
  )
  if (source !== rewritten) await writeFile(path, rewritten)
}
