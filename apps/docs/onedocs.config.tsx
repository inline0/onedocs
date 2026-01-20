import { defineConfig } from "onedocs/config";
import {
  Package,
  Settings,
  FileText,
  Search,
  Moon,
  Code,
  Zap,
  Puzzle,
} from "lucide-react";

const iconClass = "h-5 w-5 text-fd-primary";

export default defineConfig({
  title: "Onedocs",
  description: "Zero-config documentation for Next.js + Fumadocs",
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
        "Install one dependency, write markdown, ship docs. A zero-config wrapper around Next.js and Fumadocs.",
      cta: { label: "Get Started", href: "/docs" },
    },
    features: [
      {
        title: "One Dependency",
        description:
          "Bundles Fumadocs UI and MDX handling. Just add onedocs and start writing.",
        icon: <Package className={iconClass} />,
      },
      {
        title: "Zero Config",
        description:
          "Works out of the box with sensible defaults. No build tools or pipelines to configure.",
        icon: <Settings className={iconClass} />,
      },
      {
        title: "Markdown First",
        description:
          "Write .md or .mdx files in your content folder. Syntax highlighting, TOC, and search included.",
        icon: <FileText className={iconClass} />,
      },
      {
        title: "Full-text Search",
        description:
          "Built-in Orama search indexes your content automatically. Fast, local, no external services.",
        icon: <Search className={iconClass} />,
      },
      {
        title: "Dark Mode",
        description:
          "Beautiful light and dark themes out of the box. Respects system preferences automatically.",
        icon: <Moon className={iconClass} />,
      },
      {
        title: "TypeScript Ready",
        description:
          "Full TypeScript support with type-safe configuration and auto-completion in your editor.",
        icon: <Code className={iconClass} />,
      },
      {
        title: "Fast Builds",
        description:
          "Powered by Next.js with Turbopack for lightning-fast development and production builds.",
        icon: <Zap className={iconClass} />,
      },
      {
        title: "Customizable",
        description:
          "Escape hatches to Fumadocs components when you need more control over your docs.",
        icon: <Puzzle className={iconClass} />,
      },
    ],
  },
});
