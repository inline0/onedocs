# onedocs

Zero-config documentation wrapper for TanStack Start + Fumadocs. Install one dependency, write markdown, ship docs.

## Why onedocs?

Setting up documentation shouldn't require configuring multiple packages, build pipelines, and content sources. onedocs bundles everything you need:

- **TanStack Start** - Full-stack React framework with file-based routing
- **Fumadocs UI** - Beautiful documentation layouts and components
- **Fumadocs MDX** - Content loading with syntax highlighting and search

## Philosophy

- **One dependency** - `onedocs` brings TanStack Start, Fumadocs UI, Fumadocs Core, and MDX handling
- **Zero config by default** - Works out of the box with sensible defaults
- **Markdown-first** - Write `.md` or `.mdx` files, get docs
- **Escape hatches exist** - Power users can use Fumadocs components directly

## Quick Start

```bash
bun add onedocs
```

Create your config file:

```ts
// onedocs.config.ts
import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
});
```

Add your markdown files:

```
content/
└── docs/
    ├── index.mdx
    └── getting-started.mdx
```

Run the dev server:

```bash
bun run dev
```

That's it. Your docs are live.

## Configuration

```ts
import { defineConfig } from "onedocs/config";

export default defineConfig({
  // Required
  title: "My Project",

  // Optional
  description: "Documentation for My Project",
  logo: "/logo.svg",

  // Navigation
  nav: {
    links: [{ label: "Blog", href: "/blog" }],
    github: "username/repo",
  },

  // Theme
  theme: {
    primaryColor: "#3b82f6",
    darkMode: true,
  },
});
```

## Project Structure

```
your-project/
├── content/
│   └── docs/
│       ├── index.mdx
│       ├── getting-started.mdx
│       └── guides/
│           ├── meta.json
│           └── setup.mdx
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── docs.tsx
│   │   └── docs/
│   │       └── $.tsx
│   └── lib/
│       └── source.ts
├── onedocs.config.ts
├── source.config.ts
└── vite.config.ts
```

## Components

onedocs re-exports Fumadocs UI components for use in your MDX files:

```tsx
import { Callout, Card, Tabs, Tab, Steps, Step } from "onedocs/components";
```

## Documentation

For full documentation, visit [onedocs.dev](https://onedocs.dev) (coming soon).

## Development

```bash
# Install dependencies
bun install

# Run the docs site (dogfooding)
bun run dev

# Build the package
bun run build

# Run tests
cd packages/onedocs && bun test
```

## Monorepo Structure

```
onedocs/
├── apps/
│   └── docs/          # Example docs site (dogfooding)
├── packages/
│   ├── onedocs/       # The publishable package
│   └── tsconfig/      # Shared TypeScript config
```

## License

MIT
