---
title: "Introduction"
description: "Get started with Onedocs: what it adds to a Next.js and Fumadocs docs site, how to install it and where layouts, the home page and SEO are configured."
path: "."
order: 10
meta_title: "Introduction"
meta_description: "Get started with Onedocs: what it adds to a Next.js and Fumadocs docs site, how to install it and where layouts, the home page and SEO are configured."
---

# Introduction

Onedocs is a set of layouts, components and helpers for documentation sites built with Next.js and Fumadocs. You write Markdown, describe your site in one config file, and Onedocs supplies the docs shell, a home page and the SEO routes.

It is meant for standalone documentation websites, not for adding docs to an existing application.

## What Onedocs adds

On top of Fumadocs, the `onedocs` package gives you:

- **Layouts** - `DocsLayout` and `DocsPage` wrap the Fumadocs UI docs layout, with sidebar, search, theme toggle and table of contents. `HomePage` renders a landing page with hero, install commands, features and footer.
- **One config file** - `onedocs.config.ts` holds the title, description, logo, favicon, navigation links, footer and the home page content.
- **MDX components** - `mdxComponents` registers callouts, tabs, cards, steps, accordions, file trees, image zoom and type tables, so pages use them without imports.
- **CSS preset** - one import brings in Tailwind CSS v4, the Fumadocs UI theme and the Onedocs layout styles.
- **SEO helpers** - functions for `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, page metadata and Open Graph images.

## What you set up yourself

Onedocs does not bundle Next.js or Fumadocs. They are peer dependencies that you install next to it:

```bash
npm install onedocs fumadocs-core@^16 fumadocs-mdx@^14 fumadocs-ui@^16 lucide-react next@^16 react@^19.2 react-dom@^19.2
```

You also need Tailwind CSS v4, Node.js 20.9 or later, and about ten small files: the Next.js and Fumadocs MDX config, a content source, the root layout, the docs layout and the docs page route. [Getting Started](/docs/getting-started) shows each one.

## Where things are configured

| What | Where |
|------|-------|
| Site title, logo, navigation, footer | `onedocs.config.ts`, see [Configuration](/docs/configuration) |
| Home page hero and features | `homepage` in `onedocs.config.ts`, rendered by `HomePage` in `src/app/page.tsx` |
| Docs layout and pages | `src/app/docs/layout.tsx` and `src/app/docs/[[...slug]]/page.tsx`, see [Getting Started](/docs/getting-started) |
| Content folder and sidebar order | `source.config.ts` and `content/docs/meta.json` |
| MDX components | `mdxComponents`, see [Components](/docs/components) |
| Search, sitemap, robots.txt, llms.txt | Route files under `src/app/`, see [SEO & Search](/docs/seo-search) |
| Metadata and Open Graph images | `onedocs/metadata` and `onedocs/og`, see [API Reference](/docs/api-reference) |

## Philosophy

- **Markdown-first** - Write `.md` or `.mdx`, get docs
- **One config file** - Site-wide settings live in `onedocs.config.ts`
- **Escape hatches** - Need more control? Use Fumadocs directly

## Start here

- [Getting Started](/docs/getting-started)
- [Components](/docs/components)
- [SEO & Search](/docs/seo-search)
- [Configuration](/docs/configuration)
- [API Reference](/docs/api-reference)
