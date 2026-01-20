import { loader } from "fumadocs-core/source";

export interface CreateSourceOptions {
  baseUrl?: string;
}

export function createSource(
  docsSource: { toFumadocsSource: () => any },
  options: CreateSourceOptions = {}
) {
  return loader({
    source: docsSource.toFumadocsSource(),
    baseUrl: options.baseUrl ?? "/docs",
  });
}

export { loader } from "fumadocs-core/source";
