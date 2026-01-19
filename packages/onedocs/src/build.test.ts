import { describe, it, expect, beforeAll } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const distPath = join(import.meta.dir, "..", "dist");

describe("build output", () => {
  beforeAll(() => {
    if (!existsSync(distPath)) {
      throw new Error("dist folder not found - run `bun run build` first");
    }
  });

  describe("main entry files", () => {
    it("should have index.js", () => {
      expect(existsSync(join(distPath, "index.js"))).toBe(true);
    });

    it("should have index.d.ts", () => {
      expect(existsSync(join(distPath, "index.d.ts"))).toBe(true);
    });

    it("should have config.js", () => {
      expect(existsSync(join(distPath, "config.js"))).toBe(true);
    });

    it("should have config.d.ts", () => {
      expect(existsSync(join(distPath, "config.d.ts"))).toBe(true);
    });
  });

  describe("components entry files", () => {
    it("should have components/index.js", () => {
      expect(existsSync(join(distPath, "components", "index.js"))).toBe(true);
    });

    it("should have components/index.d.ts", () => {
      expect(existsSync(join(distPath, "components", "index.d.ts"))).toBe(true);
    });

    it("should have components/install-block.js", () => {
      expect(existsSync(join(distPath, "components", "install-block.js"))).toBe(true);
    });

    it("should have components/install-block.d.ts", () => {
      expect(existsSync(join(distPath, "components", "install-block.d.ts"))).toBe(true);
    });
  });

  describe("source entry files", () => {
    it("should have source/index.js", () => {
      expect(existsSync(join(distPath, "source", "index.js"))).toBe(true);
    });

    it("should have source/index.d.ts", () => {
      expect(existsSync(join(distPath, "source", "index.d.ts"))).toBe(true);
    });
  });

  describe("built exports resolve correctly", () => {
    it("should import from dist/index.js", async () => {
      const mod = await import("../dist/index.js");
      expect(mod.defineConfig).toBeDefined();
      expect(mod.RootLayout).toBeDefined();
      expect(mod.DocsLayout).toBeDefined();
      expect(mod.DocsPage).toBeDefined();
      expect(mod.HomeLayout).toBeDefined();
      expect(mod.InstallBlock).toBeDefined();
    });

    it("should import from dist/config.js", async () => {
      const mod = await import("../dist/config.js");
      expect(mod.defineConfig).toBeDefined();
      const config = mod.defineConfig({ title: "Test" });
      expect(config.title).toBe("Test");
    });

    it("should import from dist/components/index.js", async () => {
      const mod = await import("../dist/components/index.js");
      expect(mod.Callout).toBeDefined();
      expect(mod.Card).toBeDefined();
      expect(mod.Tabs).toBeDefined();
      expect(mod.InstallBlock).toBeDefined();
    });

    it("should import from dist/source/index.js", async () => {
      const mod = await import("../dist/source/index.js");
      expect(mod.createSource).toBeDefined();
      expect(mod.loader).toBeDefined();
    });
  });
});
