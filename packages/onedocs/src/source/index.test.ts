import { describe, expect, it } from "vitest";
import * as source from "./index";

describe("source index exports", () => {
  it("exports source functions", () => {
    expect(typeof source.createSource).toBe("function");
    expect(typeof source.loader).toBe("function");
  });
});
