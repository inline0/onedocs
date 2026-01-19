import { DocsPage as FumaDocsPage, DocsBody } from "fumadocs-ui/page";
import type { ReactNode } from "react";

interface DocsPageProps {
  toc?: any[];
  children: ReactNode;
}

export function DocsPage({ toc, children }: DocsPageProps) {
  return (
    <FumaDocsPage toc={toc}>
      <DocsBody>{children}</DocsBody>
    </FumaDocsPage>
  );
}

export { DocsBody };
