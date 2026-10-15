import { describe, expect, it } from "vitest";
import * as source from "./index";

const collection = {
  toFumadocsSource: () => ({
    files: [
      {
        type: "page" as const,
        path: "index.mdx",
        data: { title: "Home", body: "Page body", toc: [] },
      },
    ],
  }),
};

describe("createSource", () => {
  it("retains page content with the default docs URL", () => {
    const docs = source.createSource(collection);
    expect(docs.getPage([])?.url).toBe("/docs");
    expect(docs.getPage([])?.data.body).toBe("Page body");
    expect(docs.getPages()).toHaveLength(1);
    expect(typeof source.loader).toBe("function");
  });

  it("accepts a custom base URL", () => {
    expect(
      source.createSource(collection, { baseUrl: "/guide" }).getPage([])?.url,
    ).toBe("/guide");
  });
});
