/**
 * Site identity shown in llms.txt.
 */
export interface LLMsConfig {
  title: string
  description?: string
}

interface Page {
  url: string
  data: {
    title: string
    description?: string
    load?: () => Promise<{ structuredData?: { content?: string } }>
    getText?: (type: "raw" | "processed") => Promise<string>
  }
}

/**
 * The documentation pages available to LLM text generators.
 */
export interface LLMsSource {
  getPages: () => Page[]
}

type FumadocsPageData = {
  title?: string
  description?: string
  getText?: (type: "raw" | "processed") => Promise<string>
  load?: () => Promise<unknown>
}

type FumadocsPage = {
  url: string
  slugs: string[]
  data: FumadocsPageData
}

function toLLMPageData(
  data: FumadocsPageData,
  fallbackTitle: string
): Page["data"] {
  const getText = data.getText
  const load = data.load
    ? async () => {
        const loaded = await data.load?.()
        const structuredData =
          typeof loaded === "object" && loaded !== null
            ? (loaded as { structuredData?: { content?: string } })
                .structuredData
            : undefined
        return structuredData ? { structuredData } : {}
      }
    : undefined

  return {
    title: data.title ?? fallbackTitle,
    description: data.description,
    getText: getText ? (type: "raw" | "processed") => getText(type) : undefined,
    load,
  }
}

/**
 * Adapt a Fumadocs source to the LLM text generators.
 *
 * @param source - The typed Fumadocs page source.
 * @returns Pages with compatible text and metadata accessors.
 */
export function createLLMsSource(source: { getPages: () => FumadocsPage[] }) {
  return {
    getPages: () =>
      source.getPages().map((page) => ({
        url: page.url,
        data: toLLMPageData(
          page.data,
          page.slugs[page.slugs.length - 1] ?? page.url
        ),
      })),
  } satisfies LLMsSource
}

/**
 * Read a page as text, falling back to available loader content.
 *
 * @param page - The page and its text accessors.
 * @returns Page title, URL, description and available body text.
 */
export async function getLLMText(page: Page): Promise<string> {
  let text = ""

  if (page.data.getText) {
    for (const type of ["processed", "raw"] as const) {
      try {
        text = await page.data.getText(type)
      } catch {}
      if (text) break
    }
  }

  if (!text && page.data.load) {
    try {
      const content = await page.data.load()
      text = content?.structuredData?.content || ""
    } catch {}
  }

  return `# ${page.data.title}
URL: ${page.url}
${page.data.description ? `\n${page.data.description}\n` : ""}
${text}`
}

function sortPages(pages: Page[]): Page[] {
  return [...pages].sort((a, b) => {
    const aDepth = a.url.split("/").length
    const bDepth = b.url.split("/").length
    if (aDepth !== bDepth) return aDepth - bDepth
    return a.url.localeCompare(b.url)
  })
}

/**
 * Generate the documentation index for llms.txt.
 *
 * @param source - Documentation pages to index.
 * @param config - Site title and optional description.
 * @returns An index ordered by URL depth and then URL.
 */
export async function generateLLMsText(
  source: LLMsSource,
  config: LLMsConfig
): Promise<string> {
  const pages = sortPages(source.getPages())

  const lines = [
    `# ${config.title}`,
    "",
    config.description ? `${config.description}\n` : "",
    "## Pages",
    "",
  ]

  for (const page of pages) {
    lines.push(`- ${page.data.title}: ${page.url}`)
    if (page.data.description) {
      lines.push(`  ${page.data.description}`)
    }
  }

  lines.push("")
  lines.push("## Full Content")
  lines.push("")
  lines.push("For full documentation content, see /llms-full.txt")

  return lines.join("\n")
}

/**
 * Generate the full documentation text for llms-full.txt.
 *
 * @param source - Documentation pages to include.
 * @returns Combined page text ordered by URL depth and URL.
 */
export async function generateLLMsFullText(
  source: LLMsSource
): Promise<string> {
  const pages = sortPages(source.getPages())
  const contents = await Promise.all(pages.map(getLLMText))
  return contents.join("\n\n---\n\n")
}
