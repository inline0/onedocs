import { generateSitemap } from "onedocs-next/seo";
import meta from "../../content/docs/meta.json";

const baseUrl = "https://onedocs.dev";

export default function sitemap() {
  return generateSitemap({
    baseUrl,
    pages: meta.pages ?? [],
  });
}
