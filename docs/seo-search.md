---
title: "SEO & Search"
description: "Search, sitemap, robots.txt, and LLMs.txt."
path: "seo-search"
order: 40
section: "Usage"
meta_title: "SEO & Search"
meta_description: "Search, sitemap, robots.txt, and LLMs.txt."
---

# SEO & Search

Search comes from Fumadocs. Onedocs adds helpers for the sitemap, robots.txt and llms.txt files, all set up as Next.js App Router routes. For page metadata and Open Graph images, see `onedocs/metadata` and `onedocs/og` in the [API Reference](/docs/api-reference#metadata).

## Search

Onedocs uses the built-in Orama search from Fumadocs. Create an API route:

```ts title="src/app/api/search/route.ts"
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);
```

The search dialog that `RootProvider` adds queries `/api/search` by default, so no other setup is needed.

## Sitemap

Generate a sitemap at `/sitemap.xml`:

```ts title="src/app/sitemap.ts"
import { generateSitemap } from "onedocs/seo";
import meta from "../../content/docs/meta.json";

const baseUrl = "https://yourdomain.com";

export default function sitemap() {
  return generateSitemap({
    baseUrl,
    pages: meta.pages ?? [],
  });
}
```

`generateSitemap` lists the site root, then one URL per entry in `pages` under `/docs`. Entries starting with `---` (sidebar separators) are skipped, and `index` maps to `/docs` itself. It reads the entries as given, so pages inside subfolders need their own entries, for example `"guides/setup"`.

## Robots.txt

Generate a robots.txt at `/robots.txt`:

```ts title="src/app/robots.ts"
import { generateRobots } from "onedocs/seo";

const baseUrl = "https://yourdomain.com";

export default function robots() {
  return generateRobots({ baseUrl });
}
```

This creates:

```
User-Agent: *
Allow: /

Host: https://yourdomain.com
Sitemap: https://yourdomain.com/sitemap.xml
```

## LLMs.txt

[LLMs.txt](https://llmstxt.org/) helps AI assistants understand your documentation. Onedocs can generate both summary and full-content versions.

### Summary version

Create `/llms.txt` with page titles and descriptions:

```ts title="src/app/llms.txt/route.ts"
import { createLLMsSource, generateLLMsText } from "onedocs/llms";
import { source } from "@/lib/source";
import config from "../../../onedocs.config";

export async function GET() {
  const llmsSource = createLLMsSource(source);
  const text = await generateLLMsText(llmsSource, {
    title: config.title,
    description: config.description,
  });

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

The file starts with the title and description, lists every page as `- Title: URL` with its description, and ends with a pointer to `/llms-full.txt`. Both functions take the wrapped source from `createLLMsSource`, not the Fumadocs source itself, and return a promise.

### Full content version

Create `/llms-full.txt` with complete documentation:

```ts title="src/app/llms-full.txt/route.ts"
import { createLLMsSource, generateLLMsFullText } from "onedocs/llms";
import { source } from "@/lib/source";

export async function GET() {
  const llmsSource = createLLMsSource(source);
  const text = await generateLLMsFullText(llmsSource);

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

Each page is written as its title, URL, description and processed Markdown, with `---` between pages.

The page text comes from Fumadocs MDX's processed Markdown, which is off by default. Without it, `llms-full.txt` contains only titles, URLs and descriptions ([#3](https://github.com/inline0/onedocs/issues/3)). Turn it on in `source.config.ts`:

```ts title="source.config.ts"
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});
```

## Configuration options

### Sitemap options

```ts
generateSitemap({
  baseUrl: "https://yourdomain.com",
  pages: ["index", "getting-started", "configuration"],
  docsPath: "/docs", // Default: "/docs"
});
```

### Robots options

```ts
generateRobots({
  baseUrl: "https://yourdomain.com",
  sitemapPath: "/sitemap.xml", // Default: "/sitemap.xml"
});
```

## What you get

After setting up these routes:

| URL | What it does |
|-----|--------------|
| `/api/search?query=...` | Search API endpoint |
| `/sitemap.xml` | XML sitemap for search engines |
| `/robots.txt` | Robots file with sitemap reference |
| `/llms.txt` | Summary for AI assistants |
| `/llms-full.txt` | Full docs for AI assistants |
