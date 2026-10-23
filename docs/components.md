---
title: "Components"
description: "Built-in MDX components."
path: "components"
order: 30
section: "Usage"
meta_title: "Components"
meta_description: "The MDX components Onedocs registers through mdxComponents: callouts, tabs, cards, steps, accordions, file trees, image zoom and type tables."
---

# Components

Onedocs registers a set of Fumadocs UI components for your MDX files, so you can use them without importing them.

## Using components

Pass `mdxComponents` to your MDX content:

```tsx title="src/app/docs/[[...slug]]/page.tsx"
import { DocsPage, mdxComponents } from "onedocs"

// In your page component:
;<MDX components={mdxComponents} />
```

`mdxComponents` contains the Fumadocs UI defaults (headings with anchor links, code blocks, links, images, tables, `Card`, `Cards` and `Callout`) plus `Tab`, `Tabs`, `Step`, `Steps`, `Accordion`, `Accordions`, `File`, `Folder`, `Files`, `ImageZoom` and `TypeTable`. Every example below works with it as is.

## Callout

Highlight important information. `type` is one of `info` (the default), `warn`, `error`, `success` or `idea`:

```mdx
<Callout type="info">This is an informational callout.</Callout>

<Callout type="warn">This is a warning callout.</Callout>

<Callout type="error">This is an error callout.</Callout>
```

Add a heading with `title`:

```mdx
<Callout type="warn" title="Breaking change">
  The `docs` option was removed in version 2.
</Callout>
```

## Tabs

Organize content into tabs. Each `Tab` `value` matches an entry in `items`:

```mdx
<Tabs items={["npm", "yarn", "pnpm", "bun"]}>
  <Tab value="npm">npm install onedocs</Tab>
  <Tab value="yarn">yarn add onedocs</Tab>
  <Tab value="pnpm">pnpm add onedocs</Tab>
  <Tab value="bun">bun add onedocs</Tab>
</Tabs>
```

## Cards

Link to other pages with card grids:

```mdx
<Cards>
  <Card title="Getting Started" href="/docs/getting-started">
    Learn how to set up Onedocs
  </Card>
  <Card title="Configuration" href="/docs/configuration">
    Configure your documentation
  </Card>
</Cards>
```

## Steps

Show numbered steps:

```mdx
<Steps>
  <Step>Install Onedocs</Step>
  <Step>Create configuration</Step>
  <Step>Write documentation</Step>
</Steps>
```

## Accordion

Collapsible content for FAQs and optional detail. Only one item is open at a time:

```mdx
<Accordions>
  <Accordion title="What is Onedocs?">
    Layouts, components and SEO helpers for documentation sites built with
    Next.js and Fumadocs.
  </Accordion>
  <Accordion title="How do I install it?">
    Follow the install step in Getting Started.
  </Accordion>
</Accordions>
```

## Files

Show file trees:

```mdx
<Files>
  <Folder name="content" defaultOpen>
    <Folder name="docs" defaultOpen>
      <File name="index.mdx" />
      <File name="getting-started.mdx" />
    </Folder>
  </Folder>
  <File name="onedocs.config.ts" />
</Files>
```

## Image zoom

An image that opens full size when clicked. `width` and `height` are required for images from `public/`:

```mdx
<ImageZoom src="/screenshot.png" alt="Dashboard" width={1200} height={800} />
```

## Type table

Document the props or options of an API:

```mdx
<TypeTable
  type={{
    title: {
      type: "string",
      description: "Site name shown in the navbar.",
    },
    description: {
      type: "string",
      description: "Used for meta tags and the home page.",
      default: "undefined",
    },
  }}
/>
```

## More components

`InstallBlock` and `CodeBlock` from `onedocs` are not in `mdxComponents`. To use them in MDX, add them to the object you pass:

```tsx title="src/app/docs/[[...slug]]/page.tsx"
import { CodeBlock, DocsPage, InstallBlock, mdxComponents } from "onedocs"

// In your page component:
;<MDX components={{ ...mdxComponents, InstallBlock, CodeBlock }} />
```

For anything else, import it from Fumadocs UI in your MDX file or add it the same way:

```ts
import { Banner } from "fumadocs-ui/components/banner"
import { InlineTOC } from "fumadocs-ui/components/inline-toc"
```

See the [Fumadocs docs](https://fumadocs.dev/docs/ui/components) for the full list.
