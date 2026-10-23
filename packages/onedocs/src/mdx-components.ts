import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { Callout } from "fumadocs-ui/components/callout"
import { Card, Cards } from "fumadocs-ui/components/card"
import { File, Folder, Files } from "fumadocs-ui/components/files"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { TypeTable } from "fumadocs-ui/components/type-table"
import defaultMdxComponents from "fumadocs-ui/mdx"

export const mdxComponents = {
  ...defaultMdxComponents,
  Tab,
  Tabs,
  Callout,
  Card,
  Cards,
  Step,
  Steps,
  Accordion,
  Accordions,
  File,
  Folder,
  Files,
  ImageZoom,
  TypeTable,
}
