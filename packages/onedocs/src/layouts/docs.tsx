import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import type { OnedocsConfig } from "../config";
import { createBaseOptions } from "./shared";

interface DocsLayoutProps {
  config: OnedocsConfig;
  pageTree: any;
  children: ReactNode;
}

export function DocsLayout({ config, pageTree, children }: DocsLayoutProps) {
  return (
    <FumaDocsLayout {...createBaseOptions(config)} tree={pageTree}>
      {children}
    </FumaDocsLayout>
  );
}
