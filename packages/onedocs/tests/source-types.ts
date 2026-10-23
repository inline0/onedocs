import { createFromSource } from "fumadocs-core/search/server"
import type { Source } from "fumadocs-core/source"
import type { TOCItemType } from "fumadocs-core/toc"
import type { ComponentType } from "react"
import { createLLMsSource } from "../src/llms/index.ts"
import { createSource } from "../src/source/index.ts"

declare const docs: {
  toFumadocsSource(): Source<{
    pageData: {
      title: string
      body: ComponentType
      toc: TOCItemType[]
      custom: number
      getText(type: "raw" | "processed"): Promise<string>
    }
    metaData: { title: string; pages: string[] }
  }>
}

const source = createSource(docs)
const page = source.getPage([])
if (page) {
  const body: ComponentType = page.data.body
  const toc: TOCItemType[] = page.data.toc
  const custom: number = page.data.custom
  void [body, toc, custom]
}
createFromSource(source)
createLLMsSource(source)
