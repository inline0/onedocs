<p align="center">
  <a href="https://github.com/inline0/onedocs">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-light.svg">
      <img alt="Onedocs" src="https://raw.githubusercontent.com/inline0/onedocs/main/.github/logo-light.svg" width="280">
    </picture>
  </a>
</p>

<p align="center">
  Zero-config documentation for TanStack Start + Fumadocs
</p>

---

Install one dependency, write markdown, ship docs.

> **Note:** Onedocs is designed for standalone documentation websites, not for integrating docs into existing applications.

## Features

- **One Dependency** - Bundles TanStack Start, Fumadocs UI, and MDX handling
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

Create your config:

```tsx
// onedocs.config.tsx
import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
  nav: {
    github: "username/repo",
  },
});
```

Import the CSS preset:

```css
/* app.css */
@import "onedocs/css/preset.css";
```

Create your homepage:

```tsx
// src/routes/index.tsx
import { HomePage } from "onedocs";
import config from "../onedocs.config.tsx";

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

  // Logo with dark/light variants
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },

  // Favicon
  icon: "/icon.png",

  // Navigation
  nav: {
    github: "username/repo",
    links: [{ label: "Blog", href: "/blog" }],
  },

  // Homepage
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
// Layouts
export { RootLayout, DocsLayout, HomePage, HomeLayout } from "onedocs";

// Components
export { InstallBlock, Logo, CTASection, GitHubIcon } from "onedocs";

// Config
export { defineConfig } from "onedocs";
```

### Components (`onedocs/components`)

Re-exports Fumadocs UI components:

```ts
import { Callout, Card, Tabs, Tab, Steps, Step } from "onedocs/components";
```

### CSS (`onedocs/css/preset.css`)

Includes Tailwind, Fumadocs styles, Inter font, and OpenType features.

## Development

```bash
# Install dependencies
bun install

# Run the docs site
bun run dev

# Build the package
bun run build

# Run tests
bun test
```

## License

MIT
