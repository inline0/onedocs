import { generateRobots } from "onedocs-next/seo";

const baseUrl = "https://onedocs.dev";

export default function robots() {
  return generateRobots({ baseUrl });
}
