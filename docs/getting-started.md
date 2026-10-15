---
title: "Getting Started"
description: "Set up Onedocs in a Next.js project."
path: "getting-started"
order: 20
meta_title: "Getting Started"
meta_description: "Install Onedocs with Next.js 16, Fumadocs and Tailwind CSS v4, then create the config, content source, layouts and docs route."
---

# Getting Started

This guide sets up a documentation site with Onedocs from an empty folder. If you already have a Next.js project, skip the files you have and compare the rest.

## Prerequisites

- Node.js 20.9 or later (required by Next.js 16)
- Next.js 16 with the App Router, React 19.2 or later
- Tailwind CSS v4 (the Onedocs CSS preset imports `tailwindcss`)

## Install

Onedocs does not bundle Next.js or Fumadocs. They are peer dependencies, so you install them next to it:

```bash
npm install onedocs fumadocs-core@^16 fumadocs-mdx@^14 fumadocs-ui@^16 lucide-react next@^16 react@^19.2 react-dom@^19.2
npm install -D tailwindcss @tailwindcss/postcss typescript @types/react @types/react-dom @types/node
```

The same packages work with pnpm, yarn or bun. These ranges select the supported Fumadocs 16 and MDX 14 releases; lucide-react 0.562.x and 1.x are both supported.

Add the Next.js scripts to `package.json`:

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Project structure

Here's what you'll end up with:

```
your-project/
├── content/
│   └── docs/
│       ├── index.mdx
│       └── meta.json
├── public/
│   └── fonts/
│       └── InterVariable.woff2
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── docs/
│   │       ├── layout.tsx
│   │       └── [[...slug]]/
│   │           └── page.tsx
│   └── lib/
│       └── source.ts
├── onedocs.config.ts
├── source.config.ts
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

Let's create each file.

## Configuration files

### onedocs.config.ts

Your main config file. Only `title` is required; see [Configuration](/docs/configuration) for the rest.

```ts title="onedocs.config.ts"
import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "My Docs",
  description: "Documentation for my project",
  nav: {
    github: "username/repo",
  },
});
```

### source.config.ts

Tells Fumadocs MDX where your content lives. This is the only place the content folder is set:

```ts title="source.config.ts"
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});
```

### next.config.mjs

Enables MDX processing:

```js title="next.config.mjs"
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {};

export default withMDX(config);
```

Fumadocs MDX generates a `.source/` folder from `source.config.ts` when Next.js starts. Add `.source` to `.gitignore`.

### postcss.config.mjs

Runs Tailwind CSS v4, which the Onedocs CSS preset is built on:

```js title="postcss.config.mjs"
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### tsconfig.json

The examples below import from `@/`, so map it to `src/`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Next.js adds the remaining compiler options it needs to this file the first time you run `next dev` or `next build`.

## Source setup

### src/lib/source.ts

Loads your docs content:

```ts title="src/lib/source.ts"
import { loader } from "fumadocs-core/source";
import { docs } from "../../.source/server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
```

## App files

### src/app/layout.tsx

Your root layout:

```tsx title="src/app/layout.tsx"
import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { FontHead } from "onedocs";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Docs",
  description: "Documentation for my project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

`RootProvider` from Fumadocs UI provides the search dialog and the light and dark theme. `FontHead` preloads the Inter Variable font from `/fonts/InterVariable.woff2` and sets it as the page font. Onedocs does not ship the font file: download `InterVariable.woff2` from the [Inter releases](https://github.com/rsms/inter/releases) and put it in `public/fonts/`. Without it, text falls back to the system sans-serif font.

To build this metadata from your config instead, see `createMetadata` in the [API Reference](/docs/api-reference#createmetadata).

### src/app/globals.css

Import the CSS preset:

```css title="src/app/globals.css"
@import "onedocs/css/preset.css";

@source "./**/*.tsx";
@source "../../content/**/*.mdx";
```

The preset loads Tailwind CSS, the Fumadocs UI styles and the Onedocs layout styles. `@source` paths are relative to `globals.css`, so these two lines point at `src/app/` and at the `content/` folder in the project root.

### src/app/page.tsx

The home page. `HomePage` renders the hero, features and footer from your config:

```tsx title="src/app/page.tsx"
import { HomePage } from "onedocs";
import config from "../../onedocs.config";

export default function Home() {
  return <HomePage config={config} packageName="my-package" />;
}
```

`packageName` adds install commands for npm, yarn, pnpm and bun to the hero. Leave it out if your project is not a package.

### src/app/docs/layout.tsx

Docs layout with sidebar:

```tsx title="src/app/docs/layout.tsx"
import { DocsLayout } from "onedocs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import config from "../../../onedocs.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout config={config} pageTree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}
```

### src/app/docs/[[...slug]]/page.tsx

Individual doc pages:

```tsx title="src/app/docs/[[...slug]]/page.tsx"
import { source } from "@/lib/source";
import { DocsPage, mdxComponents } from "onedocs";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
```

## Content

### content/docs/index.mdx

Each page needs a `title` in its frontmatter. The `description` is optional:

```mdx title="content/docs/index.mdx"
---
title: Introduction
description: What this project does.
---

Welcome to the docs. Components such as `<Callout>` work without imports; see [Components](/docs/components).
```

### content/docs/meta.json

Sets the order of the sidebar:

```json title="content/docs/meta.json"
{
  "pages": ["index"]
}
```

Add a page by creating another `.mdx` file and listing its name in `pages`.

## Run it

Start the dev server:

```bash
npm run dev
```

The home page is at `http://localhost:3000` and the docs at `http://localhost:3000/docs`.

Build for production:

```bash
npm run build
```

Next, add search, a sitemap and llms.txt in [SEO & Search](/docs/seo-search).
