import { generateRobots } from "onedocs/seo";

const baseUrl = "https://onedocs.dev";

export default function robots() {
  return generateRobots({ baseUrl });
}
