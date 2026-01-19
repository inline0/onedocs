import { createFileRoute } from "@tanstack/react-router";
import { createRobotsHandler } from "onedocs/seo";

const baseUrl = "https://onedocs.dev";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: createRobotsHandler({ baseUrl }),
    },
  },
});
