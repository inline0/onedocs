import {
  loader,
  type LoaderConfig,
  type LoaderOutput,
  type MetaData,
  type PageData,
  type Source,
} from "fumadocs-core/source";

export interface CreateSourceOptions {
  baseUrl?: string;
}

type CollectionConfig = { pageData: PageData; metaData: MetaData };

// Fumadocs 16 changed the loader config shape. Resolve it against the consumer's
// installed peer so declarations built with an older peer retain content types.
type SourceLoaderConfig<Config extends CollectionConfig> =
  LoaderConfig extends {
    page: infer Page;
    meta: infer Meta;
  }
    ? {
        page: Omit<Page, "data"> & { data: Config["pageData"] };
        meta: Omit<Meta, "data"> & { data: Config["metaData"] };
        i18n: undefined;
      }
    : { source: Config; i18n: undefined };

export function createSource<Config extends CollectionConfig>(
  docsSource: { toFumadocsSource: () => Source<Config> },
  options: CreateSourceOptions = {},
): LoaderOutput<SourceLoaderConfig<Config>> {
  return loader({
    source: docsSource.toFumadocsSource(),
    baseUrl: options.baseUrl ?? "/docs",
  });
}

export { loader } from "fumadocs-core/source";
