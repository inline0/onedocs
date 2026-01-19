import { DocsLayout } from "onedocs";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { source } from "../lib/source";
import config from "../../onedocs.config";

export const Route = createFileRoute("/docs")({
  component: DocsLayoutWrapper,
});

function DocsLayoutWrapper() {
  return (
    <DocsLayout config={config} pageTree={source.pageTree}>
      <Outlet />
    </DocsLayout>
  );
}
