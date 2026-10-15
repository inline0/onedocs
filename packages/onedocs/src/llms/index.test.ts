import { describe, expect, it, vi } from "vitest";
import * as llms from "./index";

describe("llms index exports", () => {
  it("exports llms functions", () => {
    expect(typeof llms.createLLMsSource).toBe("function");
    expect(typeof llms.getLLMText).toBe("function");
    expect(typeof llms.generateLLMsText).toBe("function");
    expect(typeof llms.generateLLMsFullText).toBe("function");
  });
});

describe("page content", () => {
  const page = (data = {}) => ({
    url: "/docs/start",
    slugs: ["start"],
    data: { title: "Start", description: "Introduction", ...data },
  });

  it("prefers processed markdown", async () => {
    const getText = vi.fn(async () => "Processed body");
    const text = await llms.generateLLMsFullText(
      llms.createLLMsSource({ getPages: () => [page({ getText })] }),
    );
    expect(text).toContain("Processed body");
    expect(getText.mock.calls).toEqual([["processed"]]);
  });

  it("falls back to raw markdown with the default MDX configuration", async () => {
    const getText = vi.fn(async (type: string) => {
      if (type === "processed")
        throw new Error("includeProcessedMarkdown is disabled");
      return "# Raw markdown body";
    });
    const text = await llms.generateLLMsFullText(
      llms.createLLMsSource({ getPages: () => [page({ getText })] }),
    );
    expect(text).toContain("# Raw markdown body");
    expect(getText.mock.calls).toEqual([["processed"], ["raw"]]);
  });

  it("tries raw markdown when processed output is empty", async () => {
    const getText = async (type: string) => (type === "raw" ? "Raw body" : "");
    expect(await llms.getLLMText(page({ getText }))).toContain("Raw body");
  });

  it("retains the legacy async collection fallback", async () => {
    const getText = async () => {
      throw new Error("Text unavailable");
    };
    const load = async () => ({
      structuredData: { content: "Legacy content" },
    });
    const text = await llms.generateLLMsFullText(
      llms.createLLMsSource({ getPages: () => [page({ getText, load })] }),
    );
    expect(text).toContain("Legacy content");
  });

  it("keeps page metadata when neither content API is available", async () => {
    expect(await llms.getLLMText(page())).toContain(
      "# Start\nURL: /docs/start\n\nIntroduction",
    );
  });
});
