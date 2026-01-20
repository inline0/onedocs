import type { MetadataRoute } from "next";

export interface RobotsConfig {
  baseUrl: string;
  sitemapPath?: string;
}

export interface SitemapConfig {
  baseUrl: string;
  pages: string[];
  docsPath?: string;
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const normalizeDocsPath = (docsPath: string) => {
  const trimmed = docsPath.replace(/\/+$/, "");
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export function generateRobots({
  baseUrl,
  sitemapPath = "/sitemap.xml",
}: RobotsConfig): MetadataRoute.Robots {
  const siteUrl = normalizeBaseUrl(baseUrl);
  const sitemapUrl = sitemapPath.startsWith("/")
    ? `${siteUrl}${sitemapPath}`
    : `${siteUrl}/${sitemapPath}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl,
    host: siteUrl,
  };
}

export function generateSitemap({
  baseUrl,
  pages,
  docsPath = "/docs",
}: SitemapConfig): MetadataRoute.Sitemap {
  const siteUrl = normalizeBaseUrl(baseUrl);
  const docsBase = normalizeDocsPath(docsPath);
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
    },
  ];

  for (const page of pages) {
    if (page.startsWith("---")) continue;
    if (page.startsWith("index")) {
      urls.push({
        url: `${siteUrl}${docsBase}`,
        lastModified: now,
      });
      continue;
    }
    urls.push({
      url: `${siteUrl}${docsBase}/${page}`,
      lastModified: now,
    });
  }

  return urls;
}
