import { describe, expect, it } from "vitest";
import * as metadata from "./index";

describe("metadata index exports", () => {
  it("exports metadata functions", () => {
    expect(typeof metadata.createMetadata).toBe("function");
    expect(typeof metadata.createDocsPageMetadata).toBe("function");
  });
});
