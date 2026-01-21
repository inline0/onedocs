import { describe, expect, it } from "vitest";
import { InstallBlock } from "./install-block";
import { CodeBlock } from "./code-block";
import { Button } from "./button";
import { Logo } from "./logo";

// Note: Fumadocs re-exports are not tested here because fumadocs-ui
// includes CSS imports that vitest cannot handle. The re-exports are
// simple pass-throughs so testing them provides limited value.

describe("components index exports", () => {
  it("exports custom components", () => {
    expect(typeof InstallBlock).toBe("function");
    expect(typeof CodeBlock).toBe("function");
    expect(typeof Button).toBe("function");
    expect(typeof Logo).toBe("function");
  });
});
