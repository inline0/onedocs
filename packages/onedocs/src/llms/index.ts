export interface LLMsConfig {
  title: string;
  description?: string;
}

interface Page {
  url: string;
  data: {
    title: string;
    description?: string;
    load?: () => Promise<{ structuredData?: { content?: string } }>;
    getText?: (type: string) => Promise<string>;
  };
}

interface Source {
  getPages: () => Page[];
}

export async function getLLMText(page: Page): Promise<string> {
  let text = "";

  if (page.data.getText) {
    try {
      text = await page.data.getText("processed");
    } catch {
      // getText may not be available
    }
  }

  if (!text && page.data.load) {
    try {
      const content = await page.data.load();
      text = content?.structuredData?.content || "";
    } catch {
      // load may not be available
    }
  }

  return `# ${page.data.title}
URL: ${page.url}
${page.data.description ? `\n${page.data.description}\n` : ""}
${text}`;
}

function sortPages(pages: Page[]): Page[] {
  return [...pages].sort((a, b) => {
    // Sort by URL depth first (fewer segments = higher priority)
    const aDepth = a.url.split("/").length;
    const bDepth = b.url.split("/").length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    // Then alphabetically
    return a.url.localeCompare(b.url);
  });
}

export function createLLMsHandler(source: Source, config: LLMsConfig) {
  return {
    GET: async () => {
      const pages = sortPages(source.getPages());

      const lines = [
        `# ${config.title}`,
        "",
        config.description ? `${config.description}\n` : "",
        "## Pages",
        "",
      ];

      for (const page of pages) {
        lines.push(`- ${page.data.title}: ${page.url}`);
        if (page.data.description) {
          lines.push(`  ${page.data.description}`);
        }
      }

      lines.push("");
      lines.push("## Full Content");
      lines.push("");
      lines.push("For full documentation content, see /llms-full.txt");

      return new Response(lines.join("\n"), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    },
  };
}

export function createLLMsFullHandler(source: Source) {
  return {
    GET: async () => {
      const pages = sortPages(source.getPages());
      const contents = await Promise.all(pages.map(getLLMText));

      return new Response(contents.join("\n\n---\n\n"), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    },
  };
}
