import { describe, it, expect } from "bun:test";
import { defineConfig } from "./config";

describe("defineConfig", () => {
  it("should return config with required title", () => {
    const config = defineConfig({
      title: "Test Project",
    });

    expect(config.title).toBe("Test Project");
  });

  it("should apply default docs directory", () => {
    const config = defineConfig({
      title: "Test Project",
    });

    expect(config.docs?.dir).toBe("content/docs");
  });

  it("should apply default theme settings", () => {
    const config = defineConfig({
      title: "Test Project",
    });

    expect(config.theme?.darkMode).toBe(true);
  });

  it("should preserve custom docs directory", () => {
    const config = defineConfig({
      title: "Test Project",
      docs: {
        dir: "custom/docs",
      },
    });

    expect(config.docs?.dir).toBe("custom/docs");
  });

  it("should preserve custom theme settings", () => {
    const config = defineConfig({
      title: "Test Project",
      theme: {
        primaryColor: "#ff0000",
        darkMode: false,
      },
    });

    expect(config.theme?.primaryColor).toBe("#ff0000");
    expect(config.theme?.darkMode).toBe(false);
  });

  it("should handle nav configuration", () => {
    const config = defineConfig({
      title: "Test Project",
      nav: {
        github: "user/repo",
        links: [{ label: "Blog", href: "/blog" }],
      },
    });

    expect(config.nav?.github).toBe("user/repo");
    expect(config.nav?.links).toHaveLength(1);
    expect(config.nav?.links?.[0].label).toBe("Blog");
  });

  it("should handle homepage configuration", () => {
    const config = defineConfig({
      title: "Test Project",
      homepage: {
        hero: {
          title: "Welcome",
          description: "A great project",
          cta: { label: "Get Started", href: "/docs" },
        },
        features: [
          { title: "Fast", description: "Very fast" },
          { title: "Simple", description: "Very simple" },
        ],
      },
    });

    expect(config.homepage?.hero?.title).toBe("Welcome");
    expect(config.homepage?.features).toHaveLength(2);
  });

  it("should handle i18n configuration", () => {
    const config = defineConfig({
      title: "Test Project",
      i18n: {
        defaultLanguage: "en",
        languages: ["en", "es", "de"],
      },
    });

    expect(config.i18n?.defaultLanguage).toBe("en");
    expect(config.i18n?.languages).toContain("es");
  });

  it("should handle logo as string", () => {
    const config = defineConfig({
      title: "Test Project",
      logo: "/logo.svg",
    });

    expect(config.logo).toBe("/logo.svg");
  });

  it("should handle logo as object with light/dark variants", () => {
    const config = defineConfig({
      title: "Test Project",
      logo: {
        light: "/logo-light.svg",
        dark: "/logo-dark.svg",
      },
    });

    expect(typeof config.logo).toBe("object");
    if (typeof config.logo === "object") {
      expect(config.logo.light).toBe("/logo-light.svg");
      expect(config.logo.dark).toBe("/logo-dark.svg");
    }
  });
});
