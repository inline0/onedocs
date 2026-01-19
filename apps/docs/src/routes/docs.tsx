import { DocsLayout } from "onedocs";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import config from "../../onedocs.config";

const getPageTree = createServerFn().handler(async () => {
  const { getSource } = await import("../lib/source");
  const source = await getSource();
  return source.pageTree;
});

export const Route = createFileRoute("/docs")({
  loader: async () => {
    const pageTree = await getPageTree();
    return { pageTree };
  },
  component: DocsLayoutWrapper,
});

function DocsLayoutWrapper() {
  const { pageTree } = Route.useLoaderData();

  return (
    <DocsLayout config={config} pageTree={pageTree}>
      <Outlet />
    </DocsLayout>
  );
}
