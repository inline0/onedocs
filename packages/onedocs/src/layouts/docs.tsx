import type { Root } from "fumadocs-core/page-tree"
import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import type { OnedocsConfig } from "../config.ts"
import { createBaseOptions } from "./shared.tsx"

interface DocsLayoutProps {
  config: OnedocsConfig
  pageTree: Root
  children: ReactNode
}

/**
 * Render the documentation navigation shell.
 *
 * @param props - Component content and presentation options.
 * @returns The rendered component.
 */
export function DocsLayout({ config, pageTree, children }: DocsLayoutProps) {
  return (
    <FumaDocsLayout {...createBaseOptions(config)} tree={pageTree}>
      {children}
    </FumaDocsLayout>
  )
}
