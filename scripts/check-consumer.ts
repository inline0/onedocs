import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { parse } from "yaml"

const root = new URL("../", import.meta.url)
const workspace = parse(
  await readFile(new URL("pnpm-workspace.yaml", root), "utf8")
) as {
  catalog: Record<string, string>
}
const manifest = JSON.parse(
  await readFile(new URL("packages/onedocs/package.json", root), "utf8")
) as {
  peerDependencies: Record<string, string>
}
const directory = await mkdtemp(join(tmpdir(), "onedocs-consumer-"))
const runtimeNode = process.env.ONEDOCS_RUNTIME_NODE ?? process.execPath

try {
  const packed = JSON.parse(
    execFileSync("pnpm", ["pack", "--json", "--pack-destination", directory], {
      cwd: new URL("packages/onedocs", root),
      encoding: "utf8",
    })
  ) as { filename: string }
  assert(packed.filename, "pnpm pack did not create a package")
  const peerPackages = Object.keys(manifest.peerDependencies).map((name) => {
    const version = workspace.catalog[name]
    assert(version, `Missing catalog version for ${name}`)
    return `${name}@${version}`
  })
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({
      name: "onedocs-consumer-check",
      private: true,
      type: "module",
    })
  )
  // Resolve the real tarball with strict peer checks, independently of the
  // workspace's links. TypeScript 5.9 validates the published declaration API.
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--strict-peer-deps",
      "--no-audit",
      "--no-fund",
      resolve(directory, packed.filename),
      ...peerPackages,
      `@tailwindcss/postcss@${workspace.catalog["@tailwindcss/postcss"]}`,
      `tailwindcss@${workspace.catalog.tailwindcss}`,
      "typescript@5.9.3",
      `@types/node@${workspace.catalog["@types/node"]}`,
      `@types/react@${workspace.catalog["@types/react"]}`,
      `@types/react-dom@${workspace.catalog["@types/react-dom"]}`,
    ],
    { cwd: directory, stdio: "inherit" }
  )

  const installed = await readFile(
    join(directory, "node_modules/onedocs/package.json"),
    "utf8"
  )
  assert(
    !installed.includes("workspace:") && !installed.includes("catalog:"),
    "Published manifest contains unresolved workspace protocols"
  )
  const sourceTypes = (
    await readFile(
      new URL("packages/onedocs/tests/source-types.ts", root),
      "utf8"
    )
  )
    .replaceAll('"../src/source/index.ts"', '"onedocs/source"')
    .replaceAll('"../src/llms/index.ts"', '"onedocs/llms"')
  const files: Record<string, string> = {
    "source-types.ts": sourceTypes,
    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        esModuleInterop: true,
      },
      include: ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    }),
    "runtime.mjs": `import assert from "node:assert/strict"
import { defineConfig } from "onedocs/config"
import { createSource } from "onedocs/source"
import { createLLMsSource, generateLLMsFullText } from "onedocs/llms"
import { generateSitemap, generateRobots } from "onedocs/seo"
import { createMetadata } from "onedocs/metadata"
const config = defineConfig({ title: "Packed OneDocs" })
const source = createSource({ toFumadocsSource: () => ({ files: [{ type: "page", path: "index.mdx", data: { title: "Welcome", getText: async () => "Packed content" } }] }) })
assert.equal(source.getPage([])?.url, "/docs")
assert.match(await generateLLMsFullText(createLLMsSource(source)), /Packed content/)
assert.equal(generateSitemap({ baseUrl: "https://example.com", pages: ["index"] })[1].url, "https://example.com/docs")
assert.equal(generateRobots({ baseUrl: "https://example.com" }).sitemap, "https://example.com/sitemap.xml")
assert.equal(createMetadata(config).title.default, config.title)
console.log("Native ESM runtime checks passed on " + process.version)
`,
    "next.config.mjs": "export default { experimental: { cpus: 2 } }\n",
    "postcss.config.mjs":
      'export default { plugins: { "@tailwindcss/postcss": {} } }\n',
    "app/globals.css": '@import "onedocs/css/preset.css";\n',
    "app/layout.tsx": `import "./globals.css"
import type { ReactNode } from "react"
import { RootProvider } from "fumadocs-ui/provider/next"
import { FontHead } from "onedocs"
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><FontHead /></head><body><RootProvider>{children}</RootProvider></body></html>
}
`,
    "app/page.tsx": `import { HomePage } from "onedocs"
import { Callout } from "onedocs/components"
import { defineConfig } from "onedocs/config"
import { createMetadata } from "onedocs/metadata"
const config = defineConfig({ title: "Packed OneDocs", description: "Production consumer smoke test" })
export const metadata = createMetadata(config)
export default function Page() {
  return <HomePage config={config}><Callout title="Installed package">Packed content</Callout></HomePage>
}
`,
    "app/image/route.ts": `import { ogImageSize } from "onedocs/og"
export function GET() { return Response.json(ogImageSize) }
`,
  }
  for (const [path, content] of Object.entries(files)) {
    const destination = join(directory, path)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, content)
  }
  execFileSync(
    process.execPath,
    [join(directory, "node_modules/typescript/bin/tsc"), "-p", directory],
    { cwd: directory, stdio: "inherit" }
  )
  execFileSync(runtimeNode, [join(directory, "runtime.mjs")], {
    cwd: directory,
    stdio: "inherit",
  })
  execFileSync(
    runtimeNode,
    [join(directory, "node_modules/next/dist/bin/next"), "build"],
    {
      cwd: directory,
      stdio: "inherit",
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      timeout: 180_000,
    }
  )
  const home = await readFile(
    join(directory, ".next/server/app/index.html"),
    "utf8"
  )
  assert(
    home.includes("Packed OneDocs") && home.includes("Packed content"),
    "Production page did not render the installed package"
  )
  console.log(
    "Published declarations, native ESM and production Next.js consumer passed."
  )
} finally {
  await rm(directory, { recursive: true, force: true })
}
