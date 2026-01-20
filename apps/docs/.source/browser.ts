// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"components.mdx": () => import("../content/docs/components.mdx?collection=docs"), "configuration.mdx": () => import("../content/docs/configuration.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "seo-search.mdx": () => import("../content/docs/seo-search.mdx?collection=docs"), }),
};
export default browserCollections;