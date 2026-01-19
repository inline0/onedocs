# Onedocs

A zero-config documentation wrapper for TanStack Start + Fumadocs. Install one dependency, write markdown, ship docs.

> **Note:** Onedocs is designed for standalone documentation websites, not for integrating docs into existing applications. It's primarily used by Inline0 packages.

## Project Goal

Create a single npm-publishable package that wraps TanStack Start and Fumadocs so Inline0 projects can have documentation with minimal setup. This is NOT for people who want to customize their docs framework—it's for people who want to `bun add onedocs` and start writing markdown.

## Core Philosophy

- **One dependency**: `onedocs` brings everything (TanStack Start, Fumadocs UI, Fumadocs Core, MDX handling)
- **Zero config by default**: Works out of the box with sensible defaults
- **Markdown-first**: Write `.md` or `.mdx` files, get docs
- **Escape hatches exist**: Power users can use Fumadocs components directly if needed

---

## Monorepo Structure

Follow the `inline0/monorepo` patterns exactly:

```
onedocs/
├── package.json              # Root workspace config (private: true)
├── biome.json                # Linting/formatting
├── apps/
│   └── docs/                 # Example/test docs site (private)
│       ├── package.json
│       ├── content/
│       │   └── docs/         # Markdown docs live here
│       ├── src/
│       │   └── routes/       # TanStack Start routes
│       └── onedocs.config.ts # User config file
├── packages/
│   ├── onedocs/              # THE publishable package
│   │   ├── package.json      # name: "onedocs"
│   │   ├── src/
│   │   │   ├── index.ts      # Main exports
│   │   │   ├── cli.ts        # CLI for scaffolding
│   │   │   ├── config.ts     # Config loading
│   │   │   ├── layouts/      # Pre-built layouts
│   │   │   ├── components/   # Re-exported Fumadocs components
│   │   │   └── source/       # Content source helpers
│   │   └── tsconfig.json
│   └── tsconfig/             # Shared tsconfig (copy from monorepo)
│       ├── base.json
│       └── package-library.json
```

---

## Package Configuration

### Root `package.json`

```json
{
  "name": "onedocs-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --cwd apps/docs dev",
    "build": "bun run --cwd packages/onedocs build",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit -p packages/onedocs/tsconfig.json"
  }
}
```

### `packages/onedocs/package.json`

```json
{
  "name": "onedocs",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "onedocs": "./dist/cli.js"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.js"
    },
    "./config": {
      "types": "./dist/config.d.ts",
      "import": "./dist/config.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts src/cli.ts src/config.ts src/components/index.ts --format esm --dts --clean",
    "prepublishOnly": "bun run build"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.x",
    "@tanstack/start": "^1.x",
    "fumadocs-core": "^14.x",
    "fumadocs-ui": "^14.x",
    "fumadocs-mdx": "^10.x"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "tsup": "^8.x",
    "typescript": "^5.x"
  }
}
```

**Why tsup for build?** It's the simplest bundler for npm packages. Outputs ESM + declarations. No config needed.

---

## User Experience

### Installation

```bash
bun add onedocs
```

### Minimal Setup

**1. Create config file `onedocs.config.ts`:**

```ts
import { defineConfig } from 'onedocs/config'

export default defineConfig({
  title: 'My Project',
  description: 'Documentation for My Project',
  // That's it. Everything else has defaults.
})
```

**2. Create docs folder:**

```
content/
└── docs/
    ├── index.mdx           # Homepage
    ├── getting-started.mdx
    └── guides/
        ├── meta.json       # { "title": "Guides", "pages": ["..."] }
        └── installation.mdx
```

**3. Add routes (we provide these as copy-paste or CLI scaffold):**

```ts
// src/routes/__root.tsx
import { createRootRoute } from '@tanstack/react-router'
import { RootLayout } from 'onedocs'

export const Route = createRootRoute({
  component: RootLayout,
})

// src/routes/docs/$.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DocsPage } from 'onedocs'

export const Route = createFileRoute('/docs/$')({
  component: DocsPage,
})
```

**4. Run:**

```bash
bun run dev
```

---

## Config API

```ts
// onedocs.config.ts
import { defineConfig } from 'onedocs/config'

export default defineConfig({
  // Required
  title: string,

  // Optional with sane defaults
  description?: string,
  logo?: string | { light: string, dark: string },

  // Navigation
  nav?: {
    links?: Array<{ label: string, href: string }>,
    github?: string,  // Just the repo path, we build the icon
  },

  // Homepage (optional - we provide a default)
  homepage?: {
    hero?: {
      title?: string,       // Defaults to config.title
      description?: string, // Defaults to config.description
      cta?: { label: string, href: string },
    },
    features?: Array<{
      title: string,
      description: string,
      icon?: string,
    }>,
  },

  // Docs
  docs?: {
    dir?: string,           // Default: 'content/docs'
    sidebar?: 'auto' | SidebarConfig,
  },

  // Theme
  theme?: {
    primaryColor?: string,  // Default: Fumadocs blue
    darkMode?: boolean,     // Default: true (system preference)
  },

  // i18n (optional)
  i18n?: {
    defaultLanguage: string,
    languages: string[],
  },
})
```

---

## What We Export

### Main Export (`onedocs`)

```ts
// Layouts - pre-configured, just use them
export { RootLayout } from './layouts/root'
export { DocsLayout } from './layouts/docs'
export { DocsPage } from './layouts/docs-page'
export { HomePage } from './layouts/home'

// Config loader
export { loadConfig } from './config'

// Types
export type { OnedocsConfig } from './config'
```

### Components Export (`onedocs/components`)

Re-export useful Fumadocs components for power users:

```ts
// For people who want to break out and customize
export { Callout } from 'fumadocs-ui/components/callout'
export { Card, Cards } from 'fumadocs-ui/components/card'
export { Tab, Tabs } from 'fumadocs-ui/components/tabs'
export { Steps, Step } from 'fumadocs-ui/components/steps'
export { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
export { CodeBlock } from 'fumadocs-ui/components/codeblock'
// ... etc
```

---

## CLI (Optional)

Simple scaffolding for new projects:

```bash
bunx onedocs init
```

Creates:
- `onedocs.config.ts`
- `content/docs/index.mdx`
- `src/routes/__root.tsx`
- `src/routes/docs/$.tsx`

---

## Implementation Priority

### Phase 1: Core (MVP)
1. Monorepo setup with bun workspaces
2. Basic package structure with tsup build
3. Config system (`defineConfig`)
4. DocsLayout + DocsPage components wrapping Fumadocs
5. Content source setup (fumadocs-mdx)
6. Working example in `apps/docs`

### Phase 2: Polish
1. RootLayout with nav configuration
2. HomePage component with hero/features
3. Theme configuration
4. CLI scaffolding

### Phase 3: Extras
1. i18n support
2. Search (Orama built-in)
3. More component re-exports

---

## Publishing

Use npm (not bun publish) for reliability:

```bash
cd packages/onedocs
bun run build
npm publish
```

Or set up GitHub Actions:

```yaml
# .github/workflows/publish.yml
on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: cd packages/onedocs && bun run build
      - run: cd packages/onedocs && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@tanstack/start` | Full-stack React framework |
| `@tanstack/react-router` | File-based routing |
| `fumadocs-ui` | Pre-built doc layouts & components |
| `fumadocs-core` | Headless utilities (TOC, search, etc.) |
| `fumadocs-mdx` | MDX content loading & collections |
| `tsup` | Build the package for npm |

---

## Non-Goals

- Custom SSG/build system (use TanStack Start's)
- Plugin system (use Fumadocs directly if you need this)
- Multiple themes (one good theme, escape to Fumadocs for more)
- Blog support (this is docs-only)

---

## File Patterns

- Config: `onedocs.config.ts` at project root
- Docs: `content/docs/**/*.{md,mdx}`
- Meta: `content/docs/**/meta.json` for sidebar ordering
- Assets: `public/` (standard Vite/TanStack)

---

## Commands Reference

```bash
# Development
bun run dev              # Run example docs site

# Building
bun run build            # Build the onedocs package

# Quality
bun run lint             # Biome lint
bun run format           # Biome format
bun run typecheck        # TypeScript check

# Publishing
cd packages/onedocs && npm publish
```
