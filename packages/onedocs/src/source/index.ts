import {
  loader,
  type LoaderConfig,
  type LoaderOutput,
  type MetaData,
  type PageData,
  type Source,
} from "fumadocs-core/source"

/**
 * Optional routing settings for a content source.
 */
export interface CreateSourceOptions {
  baseUrl?: string
}

type CollectionConfig = { pageData: PageData; metaData: MetaData }

// Fumadocs 16 changed its loader config shape. Resolve it against the
// installed peer so declarations retain the consumer collection types.
type SourceLoaderConfig<Config extends CollectionConfig> =
  LoaderConfig extends {
    page: infer Page
    meta: infer Meta
  }
    ? {
        page: Omit<Page, "data" | "type"> & {
          type: undefined
          data: Config["pageData"]
        }
        meta: Omit<Meta, "data" | "type"> & {
          type: undefined
          data: Config["metaData"]
        }
        i18n: undefined
      }
    : { source: Config; i18n: undefined }

/**
 * Create a typed Fumadocs loader from an MDX collection.
 *
 * @param docsSource - Collection exposing its Fumadocs source.
 * @param options - The public documentation base URL.
 * @returns A loader preserving the collection data types.
 */
export function createSource<Config extends CollectionConfig>(
  docsSource: { toFumadocsSource: () => Source<Config> },
  options: CreateSourceOptions = {}
): LoaderOutput<SourceLoaderConfig<Config>> {
  return loader({
    source: docsSource.toFumadocsSource(),
    baseUrl: options.baseUrl ?? "/docs",
  })
}

export { loader } from "fumadocs-core/source"
