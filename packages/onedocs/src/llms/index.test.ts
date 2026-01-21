import { describe, expect, it } from "vitest";
import * as llms from "./index";

describe("llms index exports", () => {
  it("exports llms functions", () => {
    expect(typeof llms.createLLMsSource).toBe("function");
    expect(typeof llms.getLLMText).toBe("function");
    expect(typeof llms.generateLLMsText).toBe("function");
    expect(typeof llms.generateLLMsFullText).toBe("function");
  });
});
