import { describe, expect, it } from "vitest";
import * as seo from "./index";

describe("seo index exports", () => {
  it("exports seo functions", () => {
    expect(typeof seo.generateRobots).toBe("function");
    expect(typeof seo.generateSitemap).toBe("function");
  });
});
