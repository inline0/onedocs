import { describe, it, expect } from "bun:test";
import { createSource } from "./index";

describe("createSource", () => {
  it("should create source with default baseUrl", () => {
    const mockDocsSource = {
      toFumadocsSource: () => ({
        files: [],
      }),
    };

    const source = createSource(mockDocsSource);

    expect(source).toBeDefined();
  });

  it("should create source with custom baseUrl", () => {
    const mockDocsSource = {
      toFumadocsSource: () => ({
        files: [],
      }),
    };

    const source = createSource(mockDocsSource, { baseUrl: "/documentation" });

    expect(source).toBeDefined();
  });
});

describe("exports", () => {
  it("should export loader from fumadocs-core", async () => {
    const { loader } = await import("./index");
    expect(loader).toBeDefined();
    expect(typeof loader).toBe("function");
  });
});
