---
title: "Getting Started"
description: "Set up Onedocs in your project."
path: "getting-started"
order: 20
meta_title: "Getting Started"
meta_description: "Set up Onedocs in your project."
---

# Getting Started

This guide walks you through setting up Onedocs from scratch.

## Prerequisites

- Node.js 18+ or Bun 1.0+
- A Next.js project (or create one fresh)

## Install

```bash
npm install onedocs fumadocs-core fumadocs-mdx fumadocs-ui lucide-react
```

The same install works with bun, pnpm, or yarn.

## Project structure

Here's what you'll end up with:

```
your-project/
├── content/
│   └── docs/
│       ├── index.mdx
│       ├── getting-started.mdx
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
└── next.config.mjs
```

Let's create each file.

## Configuration files

### onedocs.config.ts

Your main config file:

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

Defines where your content lives:

```ts title="source.config.ts"
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});
```

### next.config.mjs

Enable MDX processing:

```js title="next.config.mjs"
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {};

export default withMDX(config);
```

## Source setup

### src/lib/source.ts

Load your docs content:

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

`FontHead` preloads the Inter Variable font. Put `InterVariable.woff2` in `public/fonts/`.

### src/app/globals.css

Import the CSS preset:

```css title="src/app/globals.css"
@import "onedocs/css/preset.css";

@source "./app/**/*.tsx";
@source "../content/**/*.mdx";
```

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

## Run it

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Your docs are ready.
