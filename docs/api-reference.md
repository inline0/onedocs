---
title: "API Reference"
description: "Complete reference for all onedocs exports."
path: "api-reference"
order: 60
section: "Reference"
meta_title: "API Reference"
meta_description: "Complete reference for all onedocs exports."
---

# API Reference

Complete reference for all exports from the `onedocs` package.

## Entry Points

| Import                   | Description                                                                       |
| ------------------------ | --------------------------------------------------------------------------------- |
| `onedocs`                | Main entry - layouts, components, `mdxComponents`, `defineConfig`, source helpers |
| `onedocs/components`     | Fumadocs UI components plus `InstallBlock`, `CodeBlock`, `Button` and `Logo`      |
| `onedocs/config`         | Configuration helpers                                                             |
| `onedocs/source`         | Content source utilities                                                          |
| `onedocs/metadata`       | Metadata generation                                                               |
| `onedocs/og`             | OpenGraph image generation                                                        |
| `onedocs/llms`           | LLMs.txt generation                                                               |
| `onedocs/seo`            | Sitemap and robots.txt                                                            |
| `onedocs/css/preset.css` | Tailwind CSS preset                                                               |

## Layouts

### DocsLayout

Main layout wrapper for documentation pages. Provides sidebar navigation, search, and theme toggle.

```tsx
import { DocsLayout } from "onedocs"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout config={config} pageTree={source.pageTree}>
      {children}
    </DocsLayout>
  )
}
```

**Props:**

- `config` - Your `OnedocsConfig` object
- `pageTree` - Page tree from your source (e.g., `source.pageTree`)
- `children` - Page content

### DocsPage

Wrapper for individual documentation pages. Wraps the Fumadocs UI `DocsPage` and puts the content in `DocsBody`.

```tsx
import { notFound } from "next/navigation"
import { DocsPage, mdxComponents } from "onedocs"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()
  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc}>
      <MDX components={mdxComponents} />
    </DocsPage>
  )
}
```

**Props:**

- `toc` - Table of contents from page data
- `children` - MDX content
- Any other prop of the Fumadocs UI `DocsPage`, such as `full`

### DocsBody

Inner body wrapper for docs content. Used internally by `DocsPage`.

```tsx
import { DocsBody } from "onedocs"

;<DocsBody>
  <MDX components={mdxComponents} />
</DocsBody>
```

### HomePage

Full landing page component with hero, features, and footer.

```tsx
import { HomePage, CTASection } from "onedocs"

export default function Home() {
  return (
    <HomePage config={config} packageName="my-package">
      <CTASection
        title="Ready to get started?"
        cta={{ label: "Read the Docs", href: "/docs" }}
      />
    </HomePage>
  )
}
```

**Props:**

- `config` - Your `OnedocsConfig` object
- `packageName` - Package name for install block (optional)
- `children` - Content between features and footer (optional)

See [homepage](/docs/configuration#homepage) and [footer](/docs/configuration#footer) for what the config controls.

### HomeLayout

Base layout for the homepage (used internally by `HomePage`).

```tsx
import { HomeLayout } from "onedocs"

;<HomeLayout config={config}>{/* Custom homepage content */}</HomeLayout>
```

### createBaseOptions

Builds the Fumadocs UI layout options (navbar title or logo, `nav.links` and the GitHub link) from your config. `DocsLayout` and `HomeLayout` use it; call it yourself when you render a Fumadocs UI layout directly.

```tsx
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { createBaseOptions } from "onedocs"

;<DocsLayout {...createBaseOptions(config)} tree={source.pageTree}>
  {children}
</DocsLayout>
```

## Components

### InstallBlock

Package manager tabs showing install commands for npm, yarn, pnpm, and bun (`npm i`, `yarn add`, `pnpm add`, `bun add`). It is an async server component.

```tsx
import { InstallBlock } from "onedocs"

;<InstallBlock packageName="onedocs" />
```

**Props:**

- `packageName` - The npm package name to install
- `title` - Heading above the tabs (optional)
- `description` - Text above the tabs (optional)
- `children` - Content below the tabs (optional)

### Button

Rounded link styled as a primary button. There is one style.

```tsx
import { Button } from "onedocs"

;<Button href="/docs">Get Started</Button>
```

**Props:**

- `href` - Link destination
- `children` - Button text
- `className` - Extra classes (optional)

### Logo

Renders a light and a dark image and shows the one that matches the current theme. `DocsLayout` and `HomePage` use it for a `logo` with light and dark variants.

```tsx
import { Logo } from "onedocs"

;<Logo
  light="/logo-light.svg"
  dark="/logo-dark.svg"
  alt="My Project"
  className="h-6"
/>
```

**Props:**

- `light` - Image path for light mode
- `dark` - Image path for dark mode
- `alt` - Alt text (default: `"Logo"`)
- `className` - Classes for both images (optional)

### CTASection

Call-to-action section for the homepage.

```tsx
import { CTASection } from "onedocs"

;<CTASection
  title="Ready to get started?"
  description="Optional description text"
  cta={{ label: "Get Started", href: "/docs" }}
/>
```

**Props:**

- `title` - Section heading
- `description` - Text under the heading (optional)
- `cta` - Button config with `label` and `href`
- `children` - Content below the button (optional)

### FontHead

Preloads the Inter Variable font, declares its `@font-face` and sets it as the font of the page. Add to your root layout's `<head>`.

```tsx
import { FontHead } from "onedocs"

;<html>
  <head>
    <FontHead />
  </head>
  <body>{children}</body>
</html>
```

Onedocs does not ship the font. By default `FontHead` loads `/fonts/InterVariable.woff2`, so put the file in `public/fonts/`, or pass another URL with `fontPath`:

```tsx
<FontHead fontPath="/assets/Inter.woff2" />
```

### GitHubIcon

GitHub icon component (used internally in navigation).

```tsx
import { GitHubIcon } from "onedocs"

;<GitHubIcon className="size-5" />
```

### CodeBlock

Syntax-highlighted code block, highlighted on the server with Shiki through Fumadocs. It is an async server component.

```tsx
import { CodeBlock } from "onedocs"

;<CodeBlock lang="tsx" code="const x = 1;" />
```

## Configuration

### defineConfig

Type-safe configuration helper.

```tsx
import { defineConfig } from "onedocs/config"

export default defineConfig({
  title: "My Docs",
  // ... other options
})
```

### OnedocsConfig

TypeScript type for configuration.

```tsx
import type { OnedocsConfig } from "onedocs/config"

const config: OnedocsConfig = {
  title: "My Docs",
}
```

See [Configuration](/docs/configuration) for all options.

## Source Utilities

### loader

Re-export of `fumadocs-core/source` loader for creating content sources.

```tsx
import { loader } from "onedocs/source"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})
```

### createSource

Helper for creating a content source (wrapper around loader). The base URL defaults to `/docs`.

```tsx
import { createSource } from "onedocs/source"
import { docs } from "../../.source/server"

export const source = createSource(docs)
// export const source = createSource(docs, { baseUrl: "/guide" });
```

`createSource` preserves your collection's page and metadata types, including `page.data.body`, `page.data.toc` and custom frontmatter fields. Its result also works with Fumadocs search and `createLLMsSource`.

## Metadata

### createMetadata

Generates Next.js metadata for your root layout.

```tsx
import { createMetadata } from "onedocs/metadata"

export const metadata = createMetadata(config, {
  baseUrl: "https://example.com",
})
```

**Options:**

- `baseUrl` - Your site's base URL (optional)
- `additional` - Extra `Metadata` fields, merged in last (optional)

**Returns:** Next.js `Metadata` object with:

- Title (`config.title`) and title template (`%s | Site Name`)
- Description
- Favicon from `config.icon`, when set
- When `baseUrl` is set: `metadataBase`, OpenGraph metadata and a Twitter `summary_large_image` card

### createDocsPageMetadata

Generates the title and description metadata for a docs page. It takes one object with `title` and an optional `description`.

```tsx
import { notFound } from "next/navigation"
import { createDocsPageMetadata } from "onedocs/metadata"

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return createDocsPageMetadata({
    title: page.data.title,
    description: page.data.description,
  })
}
```

For a per-page Open Graph image, see [Dynamic OG Images](#dynamic-og-images).

## OpenGraph Images

### createRootOGImage

Creates an OG image for the homepage: your logo centered on a black background.

```tsx
// src/app/opengraph-image.tsx
import {
  createRootOGImage,
  loadPublicFile,
  ogImageSize,
  ogImageContentType,
  type OGImageLogo,
} from "onedocs/og"

export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
  const logo = await loadPublicFile("logo-dark.svg")
  return createRootOGImage(logo as OGImageLogo)
}
```

### createDocsOGImage

Creates an OG image for docs pages: the logo top left and the title in white on black. The font argument is optional; without it the title uses the system font.

```tsx
// src/app/docs/opengraph-image.tsx
import {
  createDocsOGImage,
  loadPublicFile,
  loadInterFont,
  ogImageSize,
  ogImageContentType,
  type OGImageLogo,
} from "onedocs/og"

export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
  const [logo, font] = await Promise.all([
    loadPublicFile("logo-dark.svg"),
    loadInterFont(),
  ])
  return createDocsOGImage("Documentation", logo as OGImageLogo, font)
}
```

### Dynamic OG Images

For per-page OG images, serve them from a route. Nothing points pages at this route automatically: add it to each page's metadata yourself, for example with `openGraph: { images: "/docs/og/getting-started" }` next to the fields from `createDocsPageMetadata`.

```tsx
// src/app/docs/og/[...slug]/route.tsx
import {
  createDocsOGImage,
  loadPublicFile,
  loadInterFont,
  type OGImageLogo,
} from "onedocs/og"
import { source } from "@/lib/source"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const page = source.getPage(slug)
  const title = page?.data.title ?? "Documentation"

  const [logo, font] = await Promise.all([
    loadPublicFile("logo-dark.svg"),
    loadInterFont(),
  ])

  return createDocsOGImage(title, logo as OGImageLogo, font)
}
```

### Helper Functions

| Function               | Description                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `loadPublicFile(path)` | Loads a file from `public/` as a data URL and buffer; for SVGs it also reads the `width` and `height` attributes |
| `loadInterFont(path?)` | Loads a font from `public/` for OG images, `fonts/Inter-Medium.ttf` by default                                   |
| `ogImageSize`          | Standard OG image dimensions `{ width: 1200, height: 630 }`                                                      |
| `ogImageContentType`   | MIME type `"image/png"`                                                                                          |

**Required files:**

- `public/logo-dark.svg` - Logo for OG images. The OG helpers size it from its `width` and `height` attributes, so the `<svg>` tag needs both as plain numbers.
- `public/fonts/Inter-Medium.ttf` - Font for titles. Onedocs does not ship it.

## LLMs.txt

Generate LLMs.txt files for AI assistants.

### generateLLMsText

Generates concise LLMs.txt content. Takes a source wrapped with `createLLMsSource` and `{ title, description? }`, and returns a promise.

```tsx
// src/app/llms.txt/route.ts
import { createLLMsSource, generateLLMsText } from "onedocs/llms"
import { source } from "@/lib/source"

export async function GET() {
  const content = await generateLLMsText(createLLMsSource(source), {
    title: "My Project",
    description: "Project description",
  })

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
```

Page URLs are written as they come from the source, for example `/docs/getting-started`, without a domain.

### generateLLMsFullText

Generates full LLMs.txt with complete page content. Takes only the wrapped source and returns a promise.

```tsx
// src/app/llms-full.txt/route.ts
import { createLLMsSource, generateLLMsFullText } from "onedocs/llms"
import { source } from "@/lib/source"

export async function GET() {
  const content = await generateLLMsFullText(createLLMsSource(source))

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
```

Page bodies use processed Markdown when available, then raw Markdown, then legacy structured content. See [SEO & Search](/docs/seo-search#full-content-version).

### createLLMsSource

Wraps a Fumadocs source (`loader()` or `createSource()` result) in the shape the two functions above read: each page's URL, title, description and text loaders.

## SEO

### generateSitemap

Generates a sitemap for your docs. Takes one object: `baseUrl`, the `pages` list (usually from `meta.json`) and an optional `docsPath` (default `/docs`).

```tsx
// src/app/sitemap.ts
import { generateSitemap } from "onedocs/seo"
import meta from "../../content/docs/meta.json"

export default function sitemap() {
  return generateSitemap({
    baseUrl: "https://example.com",
    pages: meta.pages ?? [],
  })
}
```

See [SEO & Search](/docs/seo-search#sitemap) for how entries become URLs.

### generateRobots

Generates robots.txt content: allow everything, plus `Host` and `Sitemap` lines. `sitemapPath` defaults to `/sitemap.xml`.

```tsx
// src/app/robots.ts
import { generateRobots } from "onedocs/seo"

export default function robots() {
  return generateRobots({
    baseUrl: "https://example.com",
  })
}
```

## CSS Preset

Import the CSS preset in your `globals.css`:

```css
@import "onedocs/css/preset.css";

@source "./**/*.tsx";
@source "../../content/**/*.mdx";
```

The `@source` paths are relative to `src/app/globals.css`.

The preset includes:

- Tailwind CSS v4 (install `tailwindcss` and `@tailwindcss/postcss` yourself)
- Fumadocs neutral theme
- Fumadocs preset styles
- `--font-sans` set to the `--font-inter` variable that `FontHead` defines
- Inter OpenType features for body text and headings
- Full-height layout styles and the Onedocs layout tweaks

## MDX Components

The `mdxComponents` export spreads the Fumadocs UI default MDX components and adds the components below:

```tsx
import { mdxComponents } from "onedocs"

;<MDX components={mdxComponents} />
```

**Included components:**

- Fumadocs UI defaults: `pre` (code blocks), `a`, `img`, `h1` to `h6` (headings with anchors), `table`, `CodeBlockTab`, `CodeBlockTabs`, `CodeBlockTabsList`, `CodeBlockTabsTrigger`, `CalloutContainer`, `CalloutTitle`, `CalloutDescription`
- `Callout` - Info/warning/error callouts
- `Card`, `Cards` - Card layouts
- `Tab`, `Tabs` - Tabbed content
- `Step`, `Steps` - Numbered steps
- `Accordion`, `Accordions` - Collapsible sections
- `File`, `Folder`, `Files` - File trees
- `ImageZoom` - Zoomable images
- `TypeTable` - Type documentation tables

`InstallBlock` and `CodeBlock` are not included; add them yourself as shown in [Components](/docs/components#more-components).

See [Components](/docs/components) for usage examples.
