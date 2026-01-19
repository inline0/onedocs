import { describe, it, expect } from "bun:test";
import {
  getLLMText,
  createLLMsHandler,
  createLLMsFullHandler,
} from "./index";

describe("getLLMText", () => {
  it("should format page with title and url", async () => {
    const mockPage = {
      url: "/docs/getting-started",
      data: {
        title: "Getting Started",
      },
    };

    const result = await getLLMText(mockPage);

    expect(result).toContain("# Getting Started");
    expect(result).toContain("URL: /docs/getting-started");
  });

  it("should include description when present", async () => {
    const mockPage = {
      url: "/docs/intro",
      data: {
        title: "Introduction",
        description: "Learn about the project",
      },
    };

    const result = await getLLMText(mockPage);

    expect(result).toContain("# Introduction");
    expect(result).toContain("Learn about the project");
  });

  it("should use getText when available", async () => {
    const mockPage = {
      url: "/docs/test",
      data: {
        title: "Test Page",
        getText: async (type: string) => {
          if (type === "processed") {
            return "This is the processed content";
          }
          return "";
        },
      },
    };

    const result = await getLLMText(mockPage);

    expect(result).toContain("This is the processed content");
  });

  it("should fallback to load when getText fails", async () => {
    const mockPage = {
      url: "/docs/test",
      data: {
        title: "Test Page",
        getText: async () => {
          throw new Error("getText not available");
        },
        load: async () => ({
          structuredData: {
            content: "Loaded content from structuredData",
          },
        }),
      },
    };

    const result = await getLLMText(mockPage);

    expect(result).toContain("Loaded content from structuredData");
  });

  it("should handle pages without getText or load", async () => {
    const mockPage = {
      url: "/docs/minimal",
      data: {
        title: "Minimal Page",
      },
    };

    const result = await getLLMText(mockPage);

    expect(result).toContain("# Minimal Page");
    expect(result).toContain("URL: /docs/minimal");
  });
});

describe("createLLMsHandler", () => {
  it("should create handler with GET method", () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "Test Docs",
    });

    expect(handler.GET).toBeDefined();
    expect(typeof handler.GET).toBe("function");
  });

  it("should return Response with correct content type", async () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "Test Docs",
    });

    const response = await handler.GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8"
    );
  });

  it("should include title in response", async () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "My Documentation",
    });

    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("# My Documentation");
  });

  it("should include description when provided", async () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "My Docs",
      description: "Documentation for My Project",
    });

    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("Documentation for My Project");
  });

  it("should list all pages", async () => {
    const mockSource = {
      getPages: () => [
        {
          url: "/docs/intro",
          data: { title: "Introduction", description: "Get started" },
        },
        {
          url: "/docs/config",
          data: { title: "Configuration" },
        },
      ],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "Test Docs",
    });

    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("- Introduction: /docs/intro");
    expect(text).toContain("Get started");
    expect(text).toContain("- Configuration: /docs/config");
  });

  it("should include reference to llms-full.txt", async () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsHandler(mockSource, {
      title: "Test Docs",
    });

    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("/llms-full.txt");
  });
});

describe("createLLMsFullHandler", () => {
  it("should create handler with GET method", () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsFullHandler(mockSource);

    expect(handler.GET).toBeDefined();
    expect(typeof handler.GET).toBe("function");
  });

  it("should return Response with correct content type", async () => {
    const mockSource = {
      getPages: () => [],
    };

    const handler = createLLMsFullHandler(mockSource);
    const response = await handler.GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8"
    );
  });

  it("should include full content of all pages", async () => {
    const mockSource = {
      getPages: () => [
        {
          url: "/docs/page1",
          data: {
            title: "Page One",
            description: "First page",
            getText: async () => "Content of page one",
          },
        },
        {
          url: "/docs/page2",
          data: {
            title: "Page Two",
            getText: async () => "Content of page two",
          },
        },
      ],
    };

    const handler = createLLMsFullHandler(mockSource);
    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("# Page One");
    expect(text).toContain("Content of page one");
    expect(text).toContain("# Page Two");
    expect(text).toContain("Content of page two");
  });

  it("should separate pages with dividers", async () => {
    const mockSource = {
      getPages: () => [
        {
          url: "/docs/page1",
          data: { title: "Page One" },
        },
        {
          url: "/docs/page2",
          data: { title: "Page Two" },
        },
      ],
    };

    const handler = createLLMsFullHandler(mockSource);
    const response = await handler.GET();
    const text = await response.text();

    expect(text).toContain("---");
  });
});

describe("exports", () => {
  it("should export getLLMText", async () => {
    const { getLLMText } = await import("./index");
    expect(getLLMText).toBeDefined();
    expect(typeof getLLMText).toBe("function");
  });

  it("should export createLLMsHandler", async () => {
    const { createLLMsHandler } = await import("./index");
    expect(createLLMsHandler).toBeDefined();
    expect(typeof createLLMsHandler).toBe("function");
  });

  it("should export createLLMsFullHandler", async () => {
    const { createLLMsFullHandler } = await import("./index");
    expect(createLLMsFullHandler).toBeDefined();
    expect(typeof createLLMsFullHandler).toBe("function");
  });
});
