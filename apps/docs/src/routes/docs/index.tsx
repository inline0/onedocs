import { DocsPage, DocsBody } from "onedocs";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { use, cache } from "react";
import browserCollections from "../../../.source/browser";

const getPageMeta = createServerFn()
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const { getSource } = await import("../../lib/source");
    const source = await getSource();
    const page = source.getPage(slugs);
    if (!page) return null;
    return {
      title: page.data.title,
      description: page.data.description,
      toc: page.data.toc,
      filePath: page.file.path,
    };
  });

const loadContent = cache(async (filePath: string) => {
  const content = await browserCollections.docs.get(filePath);
  return content?.body;
});

export const Route = createFileRoute("/docs/")({
  loader: async () => {
    const page = await getPageMeta({ data: [] });
    if (!page) throw notFound();
    return page;
  },
  component: DocsIndexPage,
});

function DocsIndexPage() {
  const page = Route.useLoaderData();
  const MDXContent = use(loadContent(page.filePath));

  if (!MDXContent) {
    throw notFound();
  }

  return (
    <DocsPage toc={page.toc}>
      <h1>{page.title}</h1>
      {page.description && (
        <p className="text-muted-foreground">{page.description}</p>
      )}
      <DocsBody>
        <MDXContent />
      </DocsBody>
    </DocsPage>
  );
}
