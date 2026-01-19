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
      title: "Onedocs",
      description:
        "Install one dependency, write markdown, ship docs. A zero-config wrapper around TanStack Start and Fumadocs.",
      cta: { label: "Get Started", href: "/docs" },
    },
    features: [
      {
        title: "One Dependency",
        description:
          "Onedocs bundles TanStack Start, Fumadocs UI, and MDX handling. Just add onedocs and start writing.",
      },
      {
        title: "Zero Config",
        description:
          "Works out of the box with sensible defaults. No need to configure build tools or content pipelines.",
      },
      {
        title: "Markdown First",
        description:
          "Write .md or .mdx files in your content folder. Fumadocs handles syntax highlighting, TOC, and search.",
      },
    ],
  },
});
