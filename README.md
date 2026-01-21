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
  Zero-config documentation for Next.js + Fumadocs
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/onedocs"><img src="https://img.shields.io/npm/v/onedocs.svg" alt="npm version"></a>
  <a href="https://github.com/inline0/onedocs/actions/workflows/ci.yml"><img src="https://github.com/inline0/onedocs/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/inline0/onedocs/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/onedocs.svg" alt="license"></a>
</p>

---

Install one dependency, write markdown, ship docs.

> **Note:** Onedocs is designed for standalone documentation websites, not for integrating docs into existing applications.

## Features

- **One Dependency** - Bundles Next.js patterns, Fumadocs UI, and MDX handling
- **Zero Config** - Works out of the box with sensible defaults
- **Markdown First** - Write `.md` or `.mdx` files, get beautiful docs
- **Full-text Search** - Built-in Orama search indexes your content automatically
- **Dark Mode** - Beautiful light and dark themes with system preference support
- **Inter Font** - Bundled Inter variable font with OpenType features
- **TypeScript Ready** - Full type-safe configuration

## Quick Start

```bash
bun add onedocs
```

Create `onedocs.config.tsx`:

```tsx
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

Add your markdown files in `content/docs/` and run:

```bash
bun run dev
```

## Configuration

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
export { RootLayout, DocsLayout, HomePage, HomeLayout } from "onedocs";
export { InstallBlock, Logo, CTASection, GitHubIcon } from "onedocs";
export { defineConfig } from "onedocs";
```

### Components (`onedocs/components`)

```ts
import { Callout, Card, Tabs, Tab, Steps, Step } from "onedocs/components";
```

### CSS (`onedocs/css/preset.css`)

Includes Tailwind, Fumadocs styles, Inter font, and OpenType features.

## Documentation

For full documentation, visit [onedocs.dev](https://onedocs.dev).

## Development

```bash
bun install
bun run dev
bun run build
bun run test
```

## License

MIT
