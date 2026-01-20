# Onedocs

A zero-config documentation wrapper for Next.js + Fumadocs. Install one dependency, write markdown, ship docs.

> **Note:** Onedocs is designed for standalone documentation websites, not for integrating docs into existing applications. It's primarily used by Inline0 packages.

## Project Goal

Create a single npm-publishable package that wraps Next.js and Fumadocs so Inline0 projects can have documentation with minimal setup. This is NOT for people who want to customize their docs framework—it's for people who want to `bun add onedocs` and start writing markdown.

## Core Philosophy

- **One dependency**: `onedocs` brings everything (Next.js patterns, Fumadocs UI, Fumadocs Core, MDX handling)
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
│   └── docs/                 # Example/test docs site (private, Next.js)
│       ├── package.json
│       ├── content/docs/     # Markdown docs
│       ├── public/           # Static assets (logos, icons, fonts)
│       ├── src/
│       │   ├── app/          # Next.js App Router
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── globals.css
│       │   │   ├── icon.png
│       │   │   ├── opengraph-image.tsx
│       │   │   ├── docs/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── [[...slug]]/page.tsx
│       │   │   │   ├── opengraph-image.tsx
│       │   │   │   └── og/[...slug]/route.tsx
│       │   │   ├── api/search/
│       │   │   ├── llms.txt/
│       │   │   ├── llms-full.txt/
│       │   │   ├── sitemap.ts
│       │   │   └── robots.ts
│       │   └── lib/          # Source configuration
│       ├── onedocs.config.tsx
│       ├── source.config.ts
│       ├── next.config.mjs
│       └── vercel.json
├── packages/
│   ├── onedocs/              # THE publishable package
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts      # Main exports
│   │   │   ├── config.ts     # Config types & defineConfig
│   │   │   ├── layouts/      # Pre-built layouts (home, docs, docs-page)
│   │   │   ├── components/   # Components (InstallBlock, Logo, CTASection, FontHead, etc.)
│   │   │   ├── source/       # Content source helpers
│   │   │   ├── llms/         # LLMs.txt generation
│   │   │   ├── seo/          # Sitemap & robots generation
│   │   │   ├── og/           # OG image generation helpers
│   │   │   ├── metadata/     # Metadata generation helpers
│   │   │   ├── css/          # CSS preset with Tailwind + Fumadocs
│   │   │   └── mdx-components.ts
│   │   └── tsconfig.json
│   └── tsconfig/             # Shared tsconfig
```

---

## Package Exports

### Main Entry (`onedocs`)

```ts
// Layouts
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
export { CodeBlock } from "./components/code-block";
export { Button } from "./components/button";
export { Logo } from "./components/logo";
export { GitHubIcon } from "./components/icons";
export { CTASection } from "./components/cta-section";
export { FontHead } from "./components/font-head";

// MDX Components
export { mdxComponents } from "./mdx-components";
```

### LLMs Entry (`onedocs/llms`)

```ts
export { createLLMsSource, generateLLMsText, generateLLMsFullText } from "./llms";
```

### SEO Entry (`onedocs/seo`)

```ts
export { generateSitemap, generateRobots } from "./seo";
```

### OG Image Entry (`onedocs/og`)

```ts
export { createRootOGImage, createDocsOGImage } from "./og";
export { loadPublicFile, loadInterFont } from "./og";
export { ogImageSize, ogImageContentType } from "./og";
export type { OGImageLogo, LoadedFile } from "./og";
```

### Metadata Entry (`onedocs/metadata`)

```ts
export { createMetadata, createDocsPageMetadata } from "./metadata";
export type { CreateMetadataOptions } from "./metadata";
```

### CSS Entry (`onedocs/css/preset.css`)

Includes:
- Tailwind CSS v4
- Fumadocs neutral theme + preset
- Font variable configuration for Inter
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

### FontHead

Preloads Inter Variable font and sets up OpenType features:

```tsx
// In your root layout
<html lang="en" suppressHydrationWarning>
  <head>
    <FontHead />
  </head>
  <body>...</body>
</html>
```

Requires `InterVariable.woff2` in `public/fonts/`.

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
<DocsLayout config={config} pageTree={source.pageTree}>
  {children}
</DocsLayout>
```

### DocsPage

Wraps page content with table of contents:

```tsx
<DocsPage toc={page.data.toc}>
  <MDX components={mdxComponents} />
</DocsPage>
```

### InstallBlock

Package manager tabs (npm, yarn, pnpm, bun) with Shiki highlighting:

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

## OG Images

### Root OG Image

```tsx
// src/app/opengraph-image.tsx
import {
  createRootOGImage,
  loadPublicFile,
  ogImageSize,
  ogImageContentType,
  type OGImageLogo,
} from "onedocs/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  const logo = await loadPublicFile("logo-light.svg");
  return createRootOGImage(logo as OGImageLogo);
}
```

### Docs OG Image (Static)

```tsx
// src/app/docs/opengraph-image.tsx
import {
  createDocsOGImage,
  loadPublicFile,
  loadInterFont,
  ogImageSize,
  ogImageContentType,
  type OGImageLogo,
} from "onedocs/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  const [logo, font] = await Promise.all([
    loadPublicFile("logo-light.svg"),
    loadInterFont(),
  ]);
  return createDocsOGImage("Documentation", logo as OGImageLogo, font);
}
```

### Dynamic OG Images (Per Page)

```tsx
// src/app/docs/og/[...slug]/route.tsx
import {
  createDocsOGImage,
  loadPublicFile,
  loadInterFont,
  type OGImageLogo,
} from "onedocs/og";
import { source } from "@/lib/source";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  const title = page?.data.title ?? "Documentation";

  const [logo, font] = await Promise.all([
    loadPublicFile("logo-light.svg"),
    loadInterFont(),
  ]);

  return createDocsOGImage(title, logo as OGImageLogo, font);
}
```

Then reference it in docs page metadata:

```tsx
// In generateMetadata
const ogImageUrl = params.slug
  ? `/docs/og/${params.slug.join("/")}`
  : "/docs/opengraph-image";

return {
  openGraph: { images: [ogImageUrl] },
  twitter: { images: [ogImageUrl] },
};
```

Requires:
- `public/logo-light.svg` - Logo for OG images
- `public/fonts/Inter-Medium.ttf` - Font for title text

---

## Metadata Helper

```tsx
// src/app/layout.tsx
import { createMetadata } from "onedocs/metadata";
import config from "../../onedocs.config";

export const metadata = createMetadata(config, {
  baseUrl: "https://yourdomain.com",
});
```

Creates metadata with:
- Title template (`%s | Site Name`)
- Description from config
- OpenGraph and Twitter card metadata
- metadataBase for absolute URLs

---

## Implementation Pattern (Next.js App Router)

### Root Layout

```tsx
// src/app/layout.tsx
import { RootProvider } from "fumadocs-ui/provider/next";
import { FontHead } from "onedocs";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FontHead />
      </head>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

### globals.css

```css
@import "onedocs/css/preset.css";

@source "./app/**/*.tsx";
@source "../content/**/*.mdx";
```

### Homepage

```tsx
// src/app/page.tsx
import { HomePage, CTASection } from "onedocs";
import config from "../../onedocs.config";

export default function Home() {
  return (
    <HomePage config={config} packageName="onedocs">
      <CTASection
        title="Ready to get started?"
        cta={{ label: "Read the Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
```

### Docs Layout

```tsx
// src/app/docs/layout.tsx
import { DocsLayout } from "onedocs";
import { source } from "@/lib/source";
import config from "../../../onedocs.config";

export default function Layout({ children }) {
  return (
    <DocsLayout config={config} pageTree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}
```

### Docs Page

```tsx
// src/app/docs/[[...slug]]/page.tsx
import { DocsPage, mdxComponents } from "onedocs";
import { source } from "@/lib/source";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}
```

### Search API

```ts
// src/app/api/search/route.ts
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);
```

---

## Commands Reference

```bash
# Development
bun run dev              # Run example docs site

# Building
bun run build            # Build the onedocs package
bun run build:docs       # Build the docs site

# Quality
bun run lint             # Biome lint
bun run format           # Biome format
bun run typecheck        # TypeScript check

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

- `fumadocs-core`
- `fumadocs-mdx`
- `fumadocs-ui`
- `lucide-react`
- `next`
- `react` / `react-dom`

---

## Non-Goals

- Custom SSG/build system (use Next.js's)
- Plugin system (use Fumadocs directly if you need this)
- Multiple themes (one good theme, escape to Fumadocs for more)
- Blog support (this is docs-only)

---

## File Patterns

- Config: `onedocs.config.tsx` at project root (TSX for JSX icons)
- Docs: `content/docs/**/*.{md,mdx}`
- Meta: `content/docs/**/meta.json` for sidebar ordering
- Assets: `public/` (standard Next.js)
- Fonts: `public/fonts/InterVariable.woff2` (website), `public/fonts/Inter-Medium.ttf` (OG images)
- CSS: `src/app/globals.css` imports `onedocs/css/preset.css`
- Icon: `src/app/icon.png` (Next.js convention)
- OG Images: `src/app/opengraph-image.tsx`, `src/app/docs/opengraph-image.tsx`

---

## Vercel Deployment

The monorepo uses a `vercel.json` in `apps/docs/` to build correctly:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../../packages/onedocs && bun run build && cd ../../apps/docs && next build"
}
```

This ensures the onedocs package is built before the docs site.
