import { DocsPage } from "onedocs";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { source } from "../../lib/source";

export const Route = createFileRoute("/docs/")({
  component: DocsIndexPage,
});

function DocsIndexPage() {
  const page = source.getPage([]);

  if (!page) {
    throw notFound();
  }

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <h1>{page.data.title}</h1>
      {page.data.description && (
        <p className="text-muted-foreground">{page.data.description}</p>
      )}
      <MDXContent />
    </DocsPage>
  );
}
