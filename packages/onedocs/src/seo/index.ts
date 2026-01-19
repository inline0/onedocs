export interface RobotsConfig {
  baseUrl: string;
  sitemapPath?: string;
}

export interface DocsSitemapConfig {
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

export function createRobotsHandler({
  baseUrl,
  sitemapPath = "/sitemap.xml",
}: RobotsConfig) {
  const siteUrl = normalizeBaseUrl(baseUrl);
  const sitemapUrl = sitemapPath.startsWith("/")
    ? `${siteUrl}${sitemapPath}`
    : `${siteUrl}/${sitemapPath}`;
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\nHost: ${siteUrl}\n`;

  return () =>
    new Response(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
}

export function createDocsSitemapHandler({
  baseUrl,
  pages,
  docsPath = "/docs",
}: DocsSitemapConfig) {
  const siteUrl = normalizeBaseUrl(baseUrl);
  const docsBase = normalizeDocsPath(docsPath);
  const urls = [siteUrl];

  for (const page of pages) {
    if (page.startsWith("---")) continue;
    if (page.startsWith("index")) {
      urls.push(`${siteUrl}${docsBase}/`);
      continue;
    }
    urls.push(`${siteUrl}${docsBase}/${page}/`);
  }

  const now = new Date().toISOString();
  const entries = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`,
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;

  return () =>
    new Response(sitemap, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
      },
    });
}
