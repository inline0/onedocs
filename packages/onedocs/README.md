# onedocs

Zero-config documentation for Next.js + Fumadocs. Install one dependency, write markdown, ship docs.

OneDocs provides layouts, reusable components, typed configuration and SEO
helpers for standalone documentation sites. It uses Next.js App Router,
Fumadocs, React and Tailwind CSS; install those peer dependencies in your app.

```sh
pnpm add onedocs fumadocs-core@^16 fumadocs-mdx@^14 fumadocs-ui@^16 lucide-react next@^16 react@^19.2 react-dom@^19.2
pnpm add -D tailwindcss @tailwindcss/postcss typescript @types/react @types/react-dom @types/node
```

Applications need Node.js 20.9 or newer, Next.js 16, React 19.2 or newer,
Fumadocs core/UI 16.4.7 or newer, Fumadocs MDX 14.2.6 or newer and Tailwind CSS 4.
See the [getting started guide](https://onedocs.inline0.dev/docs/getting-started)
for the complete app setup.

```ts
import { defineConfig } from "onedocs/config"

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
  nav: { github: "username/repo" },
})
```

## Public exports

| Import                   | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `onedocs`                | Layouts, components, configuration and content-source helpers |
| `onedocs/components`     | OneDocs components and Fumadocs MDX components                |
| `onedocs/config`         | Site configuration types and `defineConfig`                   |
| `onedocs/source`         | Typed Fumadocs content loader                                 |
| `onedocs/llms`           | LLM-friendly plain text and routes                            |
| `onedocs/seo`            | Sitemap and robots generators                                 |
| `onedocs/metadata`       | Page metadata helpers                                         |
| `onedocs/og`             | Open Graph image generation                                   |
| `onedocs/css/preset.css` | Tailwind and Fumadocs CSS preset                              |

JavaScript exports include declarations. CSS is shipped directly from
`src/css/preset.css` and processed by the consuming application.

## Development

From the workspace root, use Node.js 26.12.0 and pnpm 12.14.0, then run
`pnpm run setup` and `pnpm verify`. The
[root README](https://github.com/inline0/onedocs#development) contains all shared
commands and [AGENTS.md](https://github.com/inline0/onedocs/blob/main/AGENTS.md)
defines conventions.

Inside this package, `pnpm build` cleans and emits the library, `pnpm clean`
removes generated output, `pnpm dev` watches TypeScript, `pnpm typecheck` checks
source and consumer type fixtures, and `pnpm test` runs Vitest once. `prepack`
builds the package and copies its license automatically.

## License

MIT
