import type { Metadata } from "next";
import type { OnedocsConfig } from "../config";

export type CreateMetadataOptions = {
  baseUrl?: string;
  additional?: Metadata;
};

export function createMetadata(
  config: OnedocsConfig,
  options: CreateMetadataOptions = {}
): Metadata {
  const { baseUrl, additional } = options;

  const metadata: Metadata = {
    title: {
      default: config.title,
      template: `%s | ${config.title}`,
    },
    description: config.description,
    ...(config.icon && {
      icons: {
        icon:
          typeof config.icon === "string"
            ? config.icon
            : [
                {
                  url: config.icon.light,
                  media: "(prefers-color-scheme: light)",
                },
                {
                  url: config.icon.dark,
                  media: "(prefers-color-scheme: dark)",
                },
              ],
      },
    }),
    ...(baseUrl && {
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: config.title,
        description: config.description,
        siteName: config.title,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: config.title,
        description: config.description,
      },
    }),
    ...additional,
  };

  return metadata;
}

export function createDocsPageMetadata(page: {
  title: string;
  description?: string;
}): Metadata {
  return {
    title: page.title,
    description: page.description,
  };
}
