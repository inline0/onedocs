<p align="center">
  <a href="https://onedocs.inline0.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-light.svg">
      <img alt="Onedocs" src="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-light.svg" height="50">
    </picture>
  </a>
</p>

<p align="center">
  Layouts, components and SEO helpers for documentation sites built with Next.js + Fumadocs
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/onedocs"><img src="https://img.shields.io/npm/v/onedocs.svg" alt="npm version"></a>
  <a href="https://github.com/inline0/onedocs/actions/workflows/ci.yml"><img src="https://github.com/inline0/onedocs/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/inline0/onedocs/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/onedocs.svg" alt="license"></a>
</p>

---

Write markdown, describe your site in one config file, ship docs.

> **Note:** Onedocs is designed for standalone documentation websites, not for integrating docs into existing applications.

## Features

- **Ready-Made Layouts** - `DocsLayout`, `DocsPage` and `HomePage` on top of Fumadocs UI
- **One Config File** - Title, logo, navigation, footer and home page in `onedocs.config.ts`
- **Markdown First** - Write `.md` or `.mdx` files, with callouts, tabs, steps and more registered for MDX
- **Full-text Search** - Fumadocs' Orama search through one API route
- **Dark Mode** - Light and dark themes from Fumadocs UI, with light and dark logo and favicon variants
- **Inter Font** - `FontHead` loads Inter Variable (you supply the font file) with OpenType features
- **SEO Helpers** - sitemap.xml, robots.txt, llms.txt, page metadata and Open Graph images
- **TypeScript Ready** - Type-safe configuration

## Quick Start

Onedocs needs Node.js 20.9+, Next.js 16 with the App Router, React 19.2 and Tailwind CSS v4. Next.js and Fumadocs are peer dependencies:

```bash
npm install onedocs fumadocs-core@^16 fumadocs-mdx@^14 fumadocs-ui@^16 lucide-react next@^16 react@^19.2 react-dom@^19.2
npm install -D tailwindcss @tailwindcss/postcss typescript @types/react @types/react-dom @types/node
```

Create `onedocs.config.ts`:

```ts
import { defineConfig } from "onedocs/config"

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
  nav: {
    github: "username/repo",
  },
})
```

Import the CSS preset in `src/app/globals.css`:

```css
@import "onedocs/css/preset.css";
```

Create your homepage in `src/app/page.tsx`:

```tsx
import { HomePage } from "onedocs"
import config from "../../onedocs.config"

export default function Home() {
  return <HomePage config={config} packageName="my-package" />
}
```

Then add the Fumadocs MDX and Next.js config, the content source, the root and docs layouts and the docs page route; the [Getting Started guide](https://onedocs.inline0.dev/docs/getting-started) shows every file. Add your markdown files in `content/docs/` and run:

```bash
npm run dev
```

## Configuration

Feature icons are React elements, so this config is `onedocs.config.tsx`:

```tsx
import { Package, Zap } from "lucide-react"
import { defineConfig } from "onedocs/config"

export default defineConfig({
  title: "My Project",
  description: "Project description",
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  icon: "/icon.png",
  nav: {
    github: "username/repo",
    links: [{ label: "Blog", href: "/blog" }],
  },
  homepage: {
    hero: {
      title: "Ship docs in minutes",
      description: "Your tagline here",
      cta: { label: "Get Started", href: "/docs" },
    },
    features: [
      {
        title: "Feature One",
        description: "Description here",
        icon: <Package className="h-5 w-5 text-fd-primary" />,
      },
      {
        title: "Feature Two",
        description: "Description here",
        icon: <Zap className="h-5 w-5 text-fd-primary" />,
      },
    ],
  },
})
```

## Exports

### Main (`onedocs`)

```ts
import { DocsLayout, DocsPage, DocsBody, HomePage, HomeLayout } from "onedocs"
import {
  InstallBlock,
  CodeBlock,
  Button,
  Logo,
  CTASection,
  FontHead,
  GitHubIcon,
} from "onedocs"
import {
  mdxComponents,
  defineConfig,
  createSource,
  loader,
  createBaseOptions,
} from "onedocs"
```

SEO helpers live in `onedocs/seo`, `onedocs/llms`, `onedocs/metadata` and `onedocs/og`. See the [API Reference](https://onedocs.inline0.dev/docs/api-reference).

### Components (`onedocs/components`)

```ts
import { Callout, Card, Tabs, Tab, Steps, Step } from "onedocs/components"
```

### CSS (`onedocs/css/preset.css`)

Includes Tailwind CSS v4, the Fumadocs UI styles, the Inter font variable that `FontHead` sets, and OpenType features. Install `tailwindcss` and `@tailwindcss/postcss` yourself.

## Documentation

For full documentation, visit [onedocs.inline0.dev](https://onedocs.inline0.dev).

## Packages

| Package                                          | Description                                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [onedocs](packages/onedocs/README.md)            | Zero-config documentation for Next.js + Fumadocs. Install one dependency, write markdown, ship docs. |
| [@onedocs/tsconfig](packages/tsconfig/README.md) | Shared TypeScript configuration for OneDocs packages.                                                |

## Development

Repository development uses Node.js **26.12.0** and pnpm **12.14.0**. Applications
using the published library continue to support Node.js **20.9 or newer**.

```sh
nvm use
pnpm run setup
pnpm verify
```

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `pnpm run setup`       | Install the frozen dependency lockfile                    |
| `pnpm build`           | Build workspace packages and declarations                 |
| `pnpm format`          | Apply the shared Oxfmt style                              |
| `pnpm format:check`    | Check formatting without changes                          |
| `pnpm lint`            | Run type-aware Oxlint, workspace and portable docs audits |
| `pnpm lint:fix`        | Apply supported lint fixes and run the audits             |
| `pnpm typecheck`       | Check scripts, library source and consumer type fixtures  |
| `pnpm test`            | Run library tests and lint-plugin regression tests        |
| `pnpm test:scripts`    | Test portable documentation validation                    |
| `pnpm test:lint-rules` | Test the shared documentation lint rules                  |
| `pnpm test:package`    | Validate every published export and package contents      |
| `pnpm test:consumer`   | Install and verify the real tarball in a temporary app    |
| `pnpm audit:workspace` | Validate package docs and catalog/workspace dependencies  |
| `pnpm audit:docs`      | Validate the six portable Markdown pages and navigation   |
| `pnpm check`           | Run format, lint, types, tests and build                  |
| `pnpm verify`          | Run `check` plus tarball and installed-consumer checks    |

The `packages/*` workspace shares a pinned pnpm catalog, ES modules, explicit
relative TypeScript imports and the formatting/linting conventions from
[Bud](https://github.com/inline0/bud) and
[Sleekos](https://github.com/inline0/sleekos). The local documentation lint
plugin is adapted from Sleekos. See [AGENTS.md](AGENTS.md) for contribution rules.
The portable documentation lives in `docs/`; it is validated in CI alongside
the installed package, production build and regression tests.

The consumer check builds a temporary Next.js app with the packed library,
its CSS preset and exact catalog peers. To test another supported runtime,
set `ONEDOCS_RUNTIME_NODE` to that Node executable. CI checks the Node.js 20.9
minimum as well as the development runtime and removes the temporary apps.

## Releases

Changes belong in [CHANGELOG.md](CHANGELOG.md). GitHub release titles match their
tag, and the release body contains only a link to the changelog for that tag.
The shared `release-format.yml` workflow keeps this consistent with the other
inline0 packages. Package publication is a separate release step after
`pnpm verify` succeeds.

## License

MIT
