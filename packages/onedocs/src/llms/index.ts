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

export interface LLMsSource {
  getPages: () => Page[];
}

type FumadocsPageData = {
  title?: string;
  description?: string;
  getText?: (type: "raw" | "processed") => Promise<string>;
  load?: () => Promise<unknown>;
};

type FumadocsPage = {
  url: string;
  slugs: string[];
  data: FumadocsPageData;
};

function toLLMPageData(
  data: FumadocsPageData,
  fallbackTitle: string,
): Page["data"] {
  const getText = data.getText;
  const load = data.load
    ? async () => {
        const loaded = await data.load?.();
        const structuredData =
          typeof loaded === "object" && loaded !== null
            ? (loaded as { structuredData?: { content?: string } }).structuredData
            : undefined;
        return structuredData ? { structuredData } : {};
      }
    : undefined;

  return {
    title: data.title ?? fallbackTitle,
    description: data.description,
    getText: getText
      ? (type: string) => getText(type as "raw" | "processed")
      : undefined,
    load,
  };
}

export function createLLMsSource(source: { getPages: () => FumadocsPage[] }) {
  return {
    getPages: () =>
      source.getPages().map((page) => ({
        url: page.url,
        data: toLLMPageData(
          page.data,
          page.slugs[page.slugs.length - 1] ?? page.url,
        ),
      })),
  } satisfies LLMsSource;
}

export async function getLLMText(page: Page): Promise<string> {
  let text = "";

  if (page.data.getText) {
    try {
      text = await page.data.getText("processed");
    } catch {}
  }

  if (!text && page.data.load) {
    try {
      const content = await page.data.load();
      text = content?.structuredData?.content || "";
    } catch {}
  }

  return `# ${page.data.title}
URL: ${page.url}
${page.data.description ? `\n${page.data.description}\n` : ""}
${text}`;
}

function sortPages(pages: Page[]): Page[] {
  return [...pages].sort((a, b) => {
    const aDepth = a.url.split("/").length;
    const bDepth = b.url.split("/").length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.url.localeCompare(b.url);
  });
}

export function createLLMsHandler(source: LLMsSource, config: LLMsConfig) {
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

export function createLLMsFullHandler(source: LLMsSource) {
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
