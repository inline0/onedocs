import { describe, expect, it } from "vitest";
import { defineConfig } from "./config";
import { createSource, loader } from "./source";
import { InstallBlock } from "./components/install-block";
import { CodeBlock } from "./components/code-block";
import { Button } from "./components/button";
import { Logo } from "./components/logo";
import { GitHubIcon } from "./components/icons";
import { CTASection } from "./components/cta-section";
import { FontHead } from "./components/font-head";

// Note: Layout components (DocsLayout, DocsPage, HomeLayout, HomePage) and
// mdxComponents are not tested here because fumadocs-ui includes CSS imports
// that vitest cannot handle. The layouts are thin wrappers around fumadocs-ui
// components so testing them provides limited value.

describe("onedocs index exports", () => {
  it("exports config", () => {
    expect(typeof defineConfig).toBe("function");
  });

  it("exports source helpers", () => {
    expect(typeof createSource).toBe("function");
    expect(typeof loader).toBe("function");
  });

  it("exports components", () => {
    expect(typeof InstallBlock).toBe("function");
    expect(typeof CodeBlock).toBe("function");
    expect(typeof Button).toBe("function");
    expect(typeof Logo).toBe("function");
    expect(typeof GitHubIcon).toBe("function");
    expect(typeof CTASection).toBe("function");
    expect(typeof FontHead).toBe("function");
  });
});
