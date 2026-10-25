import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import * as Effect from "effect/Effect"
import * as FileSystem from "effect/FileSystem"
import { parse } from "yaml"
import { emit, main, script } from "./lib/cli.ts"
import * as Command from "./lib/command.ts"
import { attempt, ensure, readJson } from "./lib/files.ts"

export const run = (root: string, runtimeNode: string, inherit = true) =>
  Effect.scoped(
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      const workspaceSource = yield* fs.readFileString(
        join(root, "pnpm-workspace.yaml")
      )
      const workspace = yield* attempt(
        () => parse(workspaceSource) as { catalog: Record<string, string> }
      )
      const manifest = yield* readJson<{
        peerDependencies: Record<string, string>
      }>(join(root, "packages/onedocs/package.json"))
      const directory = yield* fs.makeTempDirectoryScoped({
        prefix: "onedocs-consumer-",
      })
      const packedSource = yield* Command.text({
        command: "pnpm",
        args: ["pack", "--json", "--pack-destination", directory],
        cwd: join(root, "packages/onedocs"),
        timeout: "1 minute",
      })
      const packed = yield* attempt(
        () => JSON.parse(packedSource) as { filename: string }
      )
      yield* ensure(packed.filename, "pnpm pack did not create a package")
      const peerPackages: string[] = []
      for (const name of Object.keys(manifest.peerDependencies)) {
        const version = workspace.catalog[name]
        yield* ensure(version, `Missing catalog version for ${name}`)
        peerPackages.push(`${name}@${version}`)
      }
      yield* fs.writeFileString(
        join(directory, "package.json"),
        JSON.stringify({
          name: "onedocs-consumer-check",
          private: true,
          type: "module",
        })
      )
      yield* Command.run({
        command: "npm",
        args: [
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
        cwd: directory,
        inherit,
        timeout: "5 minutes",
      })
      const installed = yield* fs.readFileString(
        join(directory, "node_modules/onedocs/package.json")
      )
      yield* ensure(
        !installed.includes("workspace:") && !installed.includes("catalog:"),
        "Published manifest contains unresolved workspace protocols"
      )
      const sourceTypes = (yield* fs.readFileString(
        join(root, "packages/onedocs/tests/source-types.ts")
      ))
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
        yield* fs.makeDirectory(dirname(destination), { recursive: true })
        yield* fs.writeFileString(destination, content)
      }
      yield* Command.run({
        command: process.execPath,
        args: [
          join(directory, "node_modules/typescript/bin/tsc"),
          "-p",
          directory,
        ],
        cwd: directory,
        inherit,
        timeout: "1 minute",
      })
      yield* Command.run({
        command: runtimeNode,
        args: [join(directory, "runtime.mjs")],
        cwd: directory,
        inherit,
        timeout: "1 minute",
      })
      yield* Command.run({
        command: runtimeNode,
        args: [join(directory, "node_modules/next/dist/bin/next"), "build"],
        cwd: directory,
        inherit,
        env: { NEXT_TELEMETRY_DISABLED: "1" },
        timeout: "3 minutes",
      })
      const home = yield* fs.readFileString(
        join(directory, ".next/server/app/index.html")
      )
      yield* ensure(
        home.includes("Packed OneDocs") && home.includes("Packed content"),
        "Production page did not render the installed package"
      )
      return { declarations: true, runtime: true, productionNext: true }
    })
  )
export const command = script("check-consumer", {
  description:
    "Install the packed package and validate declarations, native ESM and a production Next.js consumer.",
  flags: {},
  run: (input) =>
    Effect.gen(function* () {
      if (input.dryRun)
        return yield* emit(
          input,
          {
            planned:
              "Pack, install and build a temporary consumer; remove it when the scope closes",
          },
          (value) => value.planned
        )
      const result = yield* run(
        fileURLToPath(new URL("../", import.meta.url)),
        process.env.ONEDOCS_RUNTIME_NODE ?? process.execPath,
        !input.json
      )
      yield* emit(
        input,
        result,
        () =>
          "Published declarations, native ESM and production Next.js consumer passed."
      )
    }),
})
if (import.meta.main) main(command)
