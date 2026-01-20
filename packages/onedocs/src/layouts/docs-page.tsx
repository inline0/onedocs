import {
  DocsPage as FumaDocsPage,
  DocsBody,
  type DocsPageProps as FumaDocsPageProps,
} from "fumadocs-ui/page";
import type { ReactNode } from "react";

interface DocsPageProps extends Omit<FumaDocsPageProps, "children"> {
  children: ReactNode;
}

export function DocsPage({ children, ...props }: DocsPageProps) {
  return (
    <FumaDocsPage {...props}>
      <DocsBody>{children}</DocsBody>
    </FumaDocsPage>
  );
}

export { DocsBody };
export type { DocsPageProps };
