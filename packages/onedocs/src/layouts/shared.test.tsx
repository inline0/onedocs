import { describe, it, expect } from "bun:test";
import { createBaseOptions } from "./shared";
import type { OnedocsConfig } from "../config";

describe("createBaseOptions", () => {
  it("should create base options with title", () => {
    const config: OnedocsConfig = {
      title: "Test Project",
    };

    const options = createBaseOptions(config);

    expect(options.nav?.title).toBe("Test Project");
  });

  it("should create empty links array when no nav links provided", () => {
    const config: OnedocsConfig = {
      title: "Test Project",
    };

    const options = createBaseOptions(config);

    expect(options.links).toEqual([]);
  });

  it("should convert nav links to proper format", () => {
    const config: OnedocsConfig = {
      title: "Test Project",
      nav: {
        links: [
          { label: "Blog", href: "/blog" },
          { label: "About", href: "/about" },
        ],
      },
    };

    const options = createBaseOptions(config);

    expect(options.links).toHaveLength(2);
    expect(options.links?.[0]).toMatchObject({
      type: "main",
      text: "Blog",
      url: "/blog",
    });
  });

  it("should add GitHub link when github is provided", () => {
    const config: OnedocsConfig = {
      title: "Test Project",
      nav: {
        github: "user/repo",
      },
    };

    const options = createBaseOptions(config);

    expect(options.links).toHaveLength(1);
    expect(options.links?.[0]).toMatchObject({
      type: "icon",
      text: "GitHub",
      url: "https://github.com/user/repo",
    });
  });

  it("should combine nav links and github link", () => {
    const config: OnedocsConfig = {
      title: "Test Project",
      nav: {
        links: [{ label: "Blog", href: "/blog" }],
        github: "user/repo",
      },
    };

    const options = createBaseOptions(config);

    expect(options.links).toHaveLength(2);
    expect(options.links?.[0]?.type).toBe("main");
    expect(options.links?.[1]?.type).toBe("icon");
  });
});
