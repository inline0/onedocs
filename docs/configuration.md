---
title: "Configuration"
description: "Configure Onedocs with onedocs.config.ts."
path: "configuration"
order: 50
section: "Reference"
meta_title: "Configuration"
meta_description: "Every onedocs.config.ts option: title, logo, favicon, navigation, footer and the home page hero and features, plus migration guidance for deprecated options."
---

# Configuration

Site-wide settings go in `onedocs.config.ts` at your project root. You pass the exported object to `DocsLayout`, `HomePage` and `createMetadata`, which read it. Where your content lives is set in `source.config.ts`, not here (see [Getting Started](/docs/getting-started)).

## Basic setup

```ts title="onedocs.config.ts"
import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",
});
```

That's the minimum. Everything else is optional.

## Full example

Feature icons are React elements, so a config that uses them must be a `.tsx` file:

```tsx title="onedocs.config.tsx"
import { defineConfig } from "onedocs/config";
import { Rocket, Zap } from "lucide-react";

export default defineConfig({
  title: "My Project",
  description: "Documentation for My Project",

  // Logo (string or light/dark variants)
  logo: "/logo.svg",
  // logo: { light: "/logo-light.svg", dark: "/logo-dark.svg" },

  // Favicon (string or light/dark variants), used by createMetadata
  icon: "/icon.png",

  // Navigation bar
  nav: {
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
    github: "username/repo",
  },

  // Homepage
  homepage: {
    hero: {
      title: "My Project",
      description: "Documentation that ships with the code",
      cta: { label: "Get Started", href: "/docs" },
    },
    features: [
      {
        title: "Fast",
        description: "Static pages built by Next.js",
        icon: <Zap className="size-5 text-fd-primary" />,
      },
      {
        title: "Simple",
        description: "Write markdown, get docs",
        icon: <Rocket className="size-5 text-fd-primary" />,
      },
    ],
  },

  // Homepage footer
  footer: {
    links: [{ label: "License", href: "https://github.com/username/repo/blob/main/LICENSE" }],
  },
});
```

## Options

### title (required)

Your site's name. The navbar shows it when no `logo` is set, `createMetadata` uses it as the default page title and in the `%s | Title` template, and the home page uses it as the hero title and in the footer copyright line.

```ts
title: "My Project"
```

### description

Short description. `createMetadata` uses it for the meta description, and the home page shows it under the hero title when `homepage.hero.description` is not set.

```ts
description: "Documentation for My Project"
```

### logo

Replaces the title in the navbar. Use a single path or light and dark variants; the image is 24 px tall and uses `title` as its alt text.

```ts
// Single logo
logo: "/logo.svg"

// Light/dark mode
logo: {
  light: "/logo-light.svg",
  dark: "/logo-dark.svg"
}
```

### icon

The favicon, set through `createMetadata`. Light and dark variants are served with `prefers-color-scheme` media queries.

```ts
icon: "/icon.png"

// Light/dark mode
icon: {
  light: "/icon-light.png",
  dark: "/icon-dark.png"
}
```

### nav

Navigation bar configuration, used by `DocsLayout` and `HomePage`.

```ts
nav: {
  // Extra links in the navbar
  links: [
    { label: "Blog", href: "/blog" },
    { label: "API", href: "/api" },
  ],

  // GitHub repo as "owner/name" (adds an icon link to https://github.com/owner/name)
  github: "username/repo",
}
```

### homepage

The hero and feature grid that `HomePage` renders.

```tsx
homepage: {
  hero: {
    title: "My Project",        // Defaults to config.title
    description: "Description", // Defaults to config.description
    cta: {
      label: "Get Started",     // Default: "Get Started"
      href: "/docs",            // Default: "/docs"
    },
  },
  features: [
    {
      title: "Feature 1",
      description: "Description of feature 1",
      icon: <Rocket className="size-5" />, // Optional React element
    },
  ],
}
```

`icon` is rendered as given, so pass an element such as a `lucide-react` icon. A string like `"rocket"` is printed as text.

Two more hero options replace parts of the default hero:

- `hero.left` replaces the title, description, install block and button with your own content. It takes a React node or a function that returns one.
- `hero.right` fills the right half of the hero. It is hidden below the `lg` breakpoint.

### footer

Links and social icons in the `HomePage` footer, next to the copyright line. Both open in a new tab.

```tsx
// import { GitHubIcon } from "onedocs";
footer: {
  links: [{ label: "Privacy", href: "/privacy" }],
  socials: [
    { label: "GitHub", href: "https://github.com/username/repo", icon: <GitHubIcon /> },
  ],
}
```

Each social link uses `label` as its accessible name.

## Deprecated options

`docs`, `theme` and `i18n` are deprecated because Onedocs does not read them. They remain accepted for compatibility and are marked deprecated in TypeScript. Move their settings to the supported configuration points:

- `docs.dir`: the content folder is the `dir` you pass to `defineDocs` in `source.config.ts`.
- `theme.primaryColor` and `theme.darkMode`: colors come from the Fumadocs UI theme that the CSS preset imports, and the light and dark modes come from Fumadocs UI's `RootProvider`.
- `i18n`: Onedocs has no multi-language support.

## TypeScript

The `defineConfig` helper gives you full autocompletion:

```ts
import { defineConfig, type OnedocsConfig } from "onedocs/config";

const config: OnedocsConfig = {
  title: "My Project",
};

export default defineConfig(config);
```

`defineConfig` returns a copy of the object you pass. It does not inject unused `docs` or `theme` defaults.
