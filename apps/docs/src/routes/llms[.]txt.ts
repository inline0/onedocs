import { createFileRoute } from "@tanstack/react-router";
import { createLLMsHandler } from "onedocs/llms";
import { source } from "@/lib/source";
import config from "../../onedocs.config.tsx";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: createLLMsHandler(source, {
      title: config.title,
      description: config.description,
    }),
  },
});
