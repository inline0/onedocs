import { defineConfig } from "onedocs/config";

export default defineConfig({
  title: "Onedocs",
  description: "Zero-config documentation for TanStack Start + Fumadocs",
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  icon: "/icon.png",
  nav: {
    github: "inline0/onedocs",
  },
  homepage: {
    hero: {
      title: "Ship docs in minutes",
      description:
        "Install one dependency, write markdown, ship docs. A zero-config wrapper around TanStack Start and Fumadocs.",
      cta: { label: "Get Started", href: "/docs" },
    },
    features: [
      {
        title: "One Dependency",
        description:
          "Bundles TanStack Start, Fumadocs UI, and MDX handling. Just add onedocs and start writing.",
        icon: "package",
      },
      {
        title: "Zero Config",
        description:
          "Works out of the box with sensible defaults. No build tools or pipelines to configure.",
        icon: "settings",
      },
      {
        title: "Markdown First",
        description:
          "Write .md or .mdx files in your content folder. Syntax highlighting, TOC, and search included.",
        icon: "file-text",
      },
      {
        title: "Full-text Search",
        description:
          "Built-in Orama search indexes your content automatically. Fast, local, no external services.",
        icon: "search",
      },
      {
        title: "Dark Mode",
        description:
          "Beautiful light and dark themes out of the box. Respects system preferences automatically.",
        icon: "moon",
      },
      {
        title: "TypeScript Ready",
        description:
          "Full TypeScript support with type-safe configuration and auto-completion in your editor.",
        icon: "code",
      },
      {
        title: "Fast Builds",
        description:
          "Powered by Vite and TanStack Start for lightning-fast development and production builds.",
        icon: "zap",
      },
      {
        title: "Customizable",
        description:
          "Escape hatches to Fumadocs components when you need more control over your docs.",
        icon: "puzzle",
      },
    ],
  },
});
