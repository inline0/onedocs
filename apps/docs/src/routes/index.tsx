import { HomePage } from "onedocs";
import { createFileRoute } from "@tanstack/react-router";
import config from "../../onedocs.config.tsx";

export const Route = createFileRoute("/")({"component": Home,
});

function Home() {
  return <HomePage config={config} packageName="onedocs" />;
}
