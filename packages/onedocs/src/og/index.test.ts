import { describe, expect, it } from "vitest";
import * as og from "./index";

describe("og index exports", () => {
  it("exports og image constants", () => {
    expect(typeof og.ogImageSize).toBe("object");
    expect(og.ogImageSize.width).toBe(1200);
    expect(og.ogImageSize.height).toBe(630);
    expect(typeof og.ogImageContentType).toBe("string");
  });

  it("exports og image functions", () => {
    expect(typeof og.loadPublicFile).toBe("function");
    expect(typeof og.loadInterFont).toBe("function");
    expect(typeof og.createRootOGImage).toBe("function");
    expect(typeof og.createDocsOGImage).toBe("function");
  });

  it("re-exports ImageResponse from next/og", () => {
    expect(typeof og.ImageResponse).toBe("function");
  });
});
