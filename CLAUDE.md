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

```
onedocs/
├── package.json              # Root workspace config (private: true)
├── biome.json                # Linting/formatting
├── .github/                  # GitHub assets (logos for README)
├── apps/
│   └── docs/                 # Example/test docs site (private)
│       ├── package.json
│       ├── content/docs/     # Markdown docs
│       ├── public/           # Static assets (logos, icons)
│       ├── src/
│       │   ├── routes/       # TanStack Start routes
│       │   ├── lib/          # Source configuration
│       │   └── app.css       # CSS entry (imports preset)
│       └── onedocs.config.tsx # Config file (TSX for JSX icons)
├── packages/
│   ├── onedocs/              # THE publishable package
│   │   ├── package.json
│   │   ├── tsup.config.ts
│   │   ├── src/
│   │   │   ├── index.ts      # Main exports
│   │   │   ├── config.ts     # Config types & defineConfig
│   │   │   ├── layouts/      # Pre-built layouts (home, docs, root)
│   │   │   ├── components/   # Components (InstallBlock, Logo, CTASection, etc.)
│   │   │   ├── source/       # Content source helpers
│   │   │   ├── css/          # CSS preset with Tailwind + Fumadocs + Inter
│   │   │   └── fonts/        # Bundled Inter variable font
│   │   └── tsconfig.json
│   └── tsconfig/             # Shared tsconfig
```

---

## Package Exports

### Main Entry (`onedocs`)

```ts
// Layouts
export { RootLayout } from "./layouts/root";
export { DocsLayout } from "./layouts/docs";
export { DocsPage, DocsBody } from "./layouts/docs-page";
export { HomeLayout, HomePage } from "./layouts/home";
export { createBaseOptions } from "./layouts/shared";

// Config
export { defineConfig } from "./config";
export type { OnedocsConfig } from "./config";

// Source helpers
export { createSource, loader } from "./source";

// Components
export { InstallBlock } from "./components/install-block";
export { Logo } from "./components/logo";
export { GitHubIcon } from "./components/icons";
export { CTASection } from "./components/cta-section";
```

### Components Entry (`onedocs/components`)

Re-exports Fumadocs UI components:

```ts
export { Callout } from "fumadocs-ui/components/callout";
export { Card, Cards } from "fumadocs-ui/components/card";
export { Tab, Tabs } from "fumadocs-ui/components/tabs";
export { Steps, Step } from "fumadocs-ui/components/steps";
export { Accordion, Accordions } from "fumadocs-ui/components/accordion";
export { File, Folder, Files } from "fumadocs-ui/components/files";
export { InstallBlock } from "./install-block";
```

### CSS Entry (`onedocs/css/preset.css`)

Includes:
- Tailwind CSS v4
- Fumadocs neutral theme + preset
- Inter variable font (bundled, with OpenType features)
- Font feature settings for body and headings
- Full-height layout styles

---

## Config API

```tsx
// onedocs.config.tsx (TSX to support JSX icons)
import { defineConfig } from "onedocs/config";
import { Package, Zap } from "lucide-react";

export default defineConfig({
  // Required
  title: string,

  // Optional
  description?: string,
  logo?: string | { light: string, dark: string },
  icon?: string, // Favicon

  // Navigation
  nav?: {
    links?: Array<{ label: string, href: string }>,
    github?: string, // Just the repo path (e.g., "inline0/onedocs")
  },

  // Homepage
  homepage?: {
    hero?: {
      title?: string,
      description?: string,
      cta?: { label: string, href: string },
    },
    features?: Array<{
      title: string,
      description: string,
      icon?: ReactNode, // Pass JSX directly (e.g., <Package className="..." />)
    }>,
  },

  // Docs
  docs?: {
    dir?: string, // Default: 'content/docs'
  },

  // Theme
  theme?: {
    primaryColor?: string,
    darkMode?: boolean, // Default: true
  },
});
```

---

## Key Components

### HomePage

Full landing page with hero, features grid, and footer:

```tsx
<HomePage config={config} packageName="my-package">
  <CTASection
    title="Ready to get started?"
    description="Check out the docs."
    cta={{ label: "Go to Docs", href: "/docs" }}
  />
</HomePage>
```

Features:
- 4-column responsive feature grid with icons
- Install block with package manager tabs
- Footer with dynamic copyright
- Vertical border lines (grid aesthetic)
- Children rendered between features and footer (centered)

### DocsLayout

Wraps Fumadocs DocsLayout with config-based nav/links:

```tsx
<DocsLayout config={config} pageTree={data.pageTree}>
  {children}
</DocsLayout>
```

### InstallBlock

Package manager tabs (npm, yarn, pnpm, bun):

```tsx
<InstallBlock packageName="onedocs" />
```

### CTASection

Centered call-to-action section:

```tsx
<CTASection
  title="Ready to get started?"
  description="Optional description"
  cta={{ label: "Button Text", href: "/path" }}
/>
```

---

## CSS Preset Details

The CSS preset (`onedocs/css/preset.css`) includes:

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

/* Inter variable font (bundled) */
@font-face {
  font-family: "Inter Variable";
  src: url("../fonts/InterVariable.woff2") format("woff2-variations");
}

/* OpenType features */
body {
  font-feature-settings: "calt" 1, "cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1, "ss08" 1;
}

h1, h2, h3, h4, h5, h6 {
  font-feature-settings: "calt" 1, "cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1, "ss07" 1, "ss08" 1, "dlig" 1;
}

/* Full-height layout */
html, body, #nd-home-layout {
  height: 100%;
}
```

---

## Implementation Pattern

### Minimal app.css

```css
@import "onedocs/css/preset.css";

@source "./routes/**/*.tsx";
@source "../content/**/*.mdx";
```

### Homepage Route

```tsx
// src/routes/index.tsx
import { HomePage, CTASection } from "onedocs";
import config from "../onedocs.config.tsx";

function Home() {
  return (
    <HomePage config={config} packageName="my-package">
      <CTASection
        title="Ready to get started?"
        cta={{ label: "Go to Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
```

### Docs Route

```tsx
// src/routes/docs/$.tsx
import { DocsLayout } from "onedocs";
import config from "../../onedocs.config.tsx";

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());
  return (
    <DocsLayout config={config} pageTree={data.pageTree}>
      {/* ... */}
    </DocsLayout>
  );
}
```

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

# Testing
bun test                 # Run tests

# Publishing
cd packages/onedocs && npm publish
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `fumadocs-core` | Headless utilities (TOC, search, source) |
| `fumadocs-ui` | Pre-built doc layouts & components |
| `fumadocs-mdx` | MDX content loading & collections |
| `lucide-react` | Icons (used internally for GitHub icon) |

### Peer Dependencies

- `@tanstack/react-router`
- `@tanstack/start`
- `react` / `react-dom`

---

## Non-Goals

- Custom SSG/build system (use TanStack Start's)
- Plugin system (use Fumadocs directly if you need this)
- Multiple themes (one good theme, escape to Fumadocs for more)
- Blog support (this is docs-only)

---

## File Patterns

- Config: `onedocs.config.tsx` at project root (TSX for JSX icons)
- Docs: `content/docs/**/*.{md,mdx}`
- Meta: `content/docs/**/meta.json` for sidebar ordering
- Assets: `public/` (standard Vite/TanStack)
- CSS: `src/app.css` imports `onedocs/css/preset.css`
