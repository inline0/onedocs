<p align="center">
  <a href="https://onedocs.dev">
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
npm install onedocs fumadocs-core fumadocs-mdx fumadocs-ui lucide-react@0.562 next react react-dom
npm install -D tailwindcss @tailwindcss/postcss typescript @types/react @types/react-dom @types/node
```

Keep the `lucide-react@0.562` pin: without it npm installs lucide-react 1.x, which conflicts with the `onedocs` peer range ([#1](https://github.com/inline0/onedocs/issues/1)).

Create `onedocs.config.ts`:

```ts
import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
  nav: {
    github: "username/repo",
  },
});
```

Import the CSS preset in `src/app/globals.css`:

```css
@import "onedocs/css/preset.css";
```

Create your homepage in `src/app/page.tsx`:

```tsx
import { HomePage } from "onedocs";
import config from "../../onedocs.config";

export default function Home() {
  return <HomePage config={config} packageName="my-package" />;
}
```

Then add the Fumadocs MDX and Next.js config, the content source, the root and docs layouts and the docs page route; the [Getting Started guide](https://onedocs.dev/docs/getting-started) shows every file. Add your markdown files in `content/docs/` and run:

```bash
npm run dev
```

## Configuration

Feature icons are React elements, so this config is `onedocs.config.tsx`:

```tsx
import { defineConfig } from "onedocs/config";
import { Package, Zap } from "lucide-react";

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
});
```

## Exports

### Main (`onedocs`)

```ts
import { DocsLayout, DocsPage, DocsBody, HomePage, HomeLayout } from "onedocs";
import { InstallBlock, CodeBlock, Button, Logo, CTASection, FontHead, GitHubIcon } from "onedocs";
import { mdxComponents, defineConfig, createSource, loader, createBaseOptions } from "onedocs";
```

SEO helpers live in `onedocs/seo`, `onedocs/llms`, `onedocs/metadata` and `onedocs/og`. See the [API Reference](https://onedocs.dev/docs/api-reference).

### Components (`onedocs/components`)

```ts
import { Callout, Card, Tabs, Tab, Steps, Step } from "onedocs/components";
```

### CSS (`onedocs/css/preset.css`)

Includes Tailwind CSS v4, the Fumadocs UI styles, the Inter font variable that `FontHead` sets, and OpenType features. Install `tailwindcss` and `@tailwindcss/postcss` yourself.

## Documentation

For full documentation, visit [onedocs.dev](https://onedocs.dev).

## Development

```bash
bun install
bun run build
bun run --cwd packages/onedocs test
```

The portable Markdown documentation lives in `docs/` at the repository root. Validate it with:

```bash
node scripts/check-docs-content.mjs --expected-docs 6 --expected-nav 1
```

## License

MIT
