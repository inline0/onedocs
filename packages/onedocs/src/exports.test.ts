import { describe, it, expect } from "bun:test";

describe("package exports", () => {
  describe("main entry (onedocs)", () => {
    it("should export RootLayout", async () => {
      const { RootLayout } = await import("./index");
      expect(RootLayout).toBeDefined();
      expect(typeof RootLayout).toBe("function");
    });

    it("should export DocsLayout", async () => {
      const { DocsLayout } = await import("./index");
      expect(DocsLayout).toBeDefined();
      expect(typeof DocsLayout).toBe("function");
    });

    it("should export DocsPage", async () => {
      const { DocsPage } = await import("./index");
      expect(DocsPage).toBeDefined();
      expect(typeof DocsPage).toBe("function");
    });

    it("should export DocsBody", async () => {
      const { DocsBody } = await import("./index");
      expect(DocsBody).toBeDefined();
    });

    it("should export HomeLayout", async () => {
      const { HomeLayout } = await import("./index");
      expect(HomeLayout).toBeDefined();
      expect(typeof HomeLayout).toBe("function");
    });

    it("should export HomePage", async () => {
      const { HomePage } = await import("./index");
      expect(HomePage).toBeDefined();
      expect(typeof HomePage).toBe("function");
    });

    it("should export InstallBlock", async () => {
      const { InstallBlock } = await import("./index");
      expect(InstallBlock).toBeDefined();
      expect(typeof InstallBlock).toBe("function");
    });

    it("should export defineConfig", async () => {
      const { defineConfig } = await import("./index");
      expect(defineConfig).toBeDefined();
      expect(typeof defineConfig).toBe("function");
    });

    it("should export createBaseOptions", async () => {
      const { createBaseOptions } = await import("./index");
      expect(createBaseOptions).toBeDefined();
      expect(typeof createBaseOptions).toBe("function");
    });

    it("should export createSource", async () => {
      const { createSource } = await import("./index");
      expect(createSource).toBeDefined();
      expect(typeof createSource).toBe("function");
    });

    it("should export loader", async () => {
      const { loader } = await import("./index");
      expect(loader).toBeDefined();
      expect(typeof loader).toBe("function");
    });
  });

  describe("config entry (onedocs/config)", () => {
    it("should export defineConfig", async () => {
      const { defineConfig } = await import("./config");
      expect(defineConfig).toBeDefined();
      expect(typeof defineConfig).toBe("function");
    });

    it("defineConfig should return valid config", async () => {
      const { defineConfig } = await import("./config");
      const config = defineConfig({ title: "Test" });
      expect(config.title).toBe("Test");
      expect(config.docs?.dir).toBe("content/docs");
    });
  });

  describe("components entry (onedocs/components)", () => {
    it("should export Callout", async () => {
      const { Callout } = await import("./components/index");
      expect(Callout).toBeDefined();
    });

    it("should export Card and Cards", async () => {
      const { Card, Cards } = await import("./components/index");
      expect(Card).toBeDefined();
      expect(Cards).toBeDefined();
    });

    it("should export Tab and Tabs", async () => {
      const { Tab, Tabs } = await import("./components/index");
      expect(Tab).toBeDefined();
      expect(Tabs).toBeDefined();
    });

    it("should export Steps and Step", async () => {
      const { Steps, Step } = await import("./components/index");
      expect(Steps).toBeDefined();
      expect(Step).toBeDefined();
    });

    it("should export Accordion and Accordions", async () => {
      const { Accordion, Accordions } = await import("./components/index");
      expect(Accordion).toBeDefined();
      expect(Accordions).toBeDefined();
    });

    it("should export File, Folder, Files", async () => {
      const { File, Folder, Files } = await import("./components/index");
      expect(File).toBeDefined();
      expect(Folder).toBeDefined();
      expect(Files).toBeDefined();
    });

    it("should export InstallBlock", async () => {
      const { InstallBlock } = await import("./components/index");
      expect(InstallBlock).toBeDefined();
      expect(typeof InstallBlock).toBe("function");
    });
  });

  describe("source entry (onedocs/source)", () => {
    it("should export createSource", async () => {
      const { createSource } = await import("./source/index");
      expect(createSource).toBeDefined();
      expect(typeof createSource).toBe("function");
    });

    it("should export loader", async () => {
      const { loader } = await import("./source/index");
      expect(loader).toBeDefined();
      expect(typeof loader).toBe("function");
    });
  });

  describe("llms entry (onedocs/llms)", () => {
    it("should export getLLMText", async () => {
      const { getLLMText } = await import("./llms/index");
      expect(getLLMText).toBeDefined();
      expect(typeof getLLMText).toBe("function");
    });

    it("should export createLLMsHandler", async () => {
      const { createLLMsHandler } = await import("./llms/index");
      expect(createLLMsHandler).toBeDefined();
      expect(typeof createLLMsHandler).toBe("function");
    });

    it("should export createLLMsFullHandler", async () => {
      const { createLLMsFullHandler } = await import("./llms/index");
      expect(createLLMsFullHandler).toBeDefined();
      expect(typeof createLLMsFullHandler).toBe("function");
    });

    it("should export createLLMsSource", async () => {
      const { createLLMsSource } = await import("./llms/index");
      expect(createLLMsSource).toBeDefined();
      expect(typeof createLLMsSource).toBe("function");
    });
  });
});
