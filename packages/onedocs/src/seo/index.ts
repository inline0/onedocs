import type { MetadataRoute } from "next"

/**
 * Site URL and sitemap location for robots.txt.
 */
export interface RobotsConfig {
  baseUrl: string
  sitemapPath?: string
}

/**
 * Site URL, documentation route and page slugs for a sitemap.
 */
export interface SitemapConfig {
  baseUrl: string
  pages: string[]
  docsPath?: string
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "")

const normalizeDocsPath = (docsPath: string) => {
  const trimmed = docsPath.replace(/\/+$/, "")
  if (!trimmed || trimmed === "/") return ""
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

/**
 * Allow crawling and advertise the site sitemap.
 *
 * @param config - Site URL and sitemap path.
 * @returns A Next.js robots metadata route.
 */
export function generateRobots({
  baseUrl,
  sitemapPath = "/sitemap.xml",
}: RobotsConfig): MetadataRoute.Robots {
  const siteUrl = normalizeBaseUrl(baseUrl)
  const sitemapUrl = sitemapPath.startsWith("/")
    ? `${siteUrl}${sitemapPath}`
    : `${siteUrl}/${sitemapPath}`

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl,
    host: siteUrl,
  }
}

/**
 * Build a sitemap from the site URL and documentation slugs.
 *
 * @param config - Site URL, documentation path and page slugs.
 * @returns Sitemap entries for the home and documentation pages.
 */
export function generateSitemap({
  baseUrl,
  pages,
  docsPath = "/docs",
}: SitemapConfig): MetadataRoute.Sitemap {
  const siteUrl = normalizeBaseUrl(baseUrl)
  const docsBase = normalizeDocsPath(docsPath)
  const now = new Date()

  const urls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
    },
  ]

  for (const page of pages) {
    if (page.startsWith("---")) continue
    if (page.startsWith("index")) {
      urls.push({
        url: `${siteUrl}${docsBase}`,
        lastModified: now,
      })
      continue
    }
    urls.push({
      url: `${siteUrl}${docsBase}/${page}`,
      lastModified: now,
    })
  }

  return urls
}
