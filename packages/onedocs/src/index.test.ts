import { describe, expect, it } from "vitest"
import { Button } from "./components/button.tsx"
import { CodeBlock } from "./components/code-block.tsx"
import { CTASection } from "./components/cta-section.tsx"
import { FontHead } from "./components/font-head.tsx"
import { GitHubIcon } from "./components/icons.tsx"
import { InstallBlock } from "./components/install-block.tsx"
import { Logo } from "./components/logo.tsx"
import { defineConfig } from "./config.ts"
import { createSource, loader } from "./source/index.ts"

// Note: Layout components (DocsLayout, DocsPage, HomeLayout, HomePage) and
// mdxComponents are not tested here because fumadocs-ui includes CSS imports
// that vitest cannot handle. The layouts are thin wrappers around fumadocs-ui
// components so testing them provides limited value.

describe("onedocs index exports", () => {
  it("exports config", () => {
    expect(typeof defineConfig).toBe("function")
  })

  it("exports source helpers", () => {
    expect(typeof createSource).toBe("function")
    expect(typeof loader).toBe("function")
  })

  it("exports components", () => {
    expect(typeof InstallBlock).toBe("function")
    expect(typeof CodeBlock).toBe("function")
    expect(typeof Button).toBe("function")
    expect(typeof Logo).toBe("function")
    expect(typeof GitHubIcon).toBe("function")
    expect(typeof CTASection).toBe("function")
    expect(typeof FontHead).toBe("function")
  })
})
