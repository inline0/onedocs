import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export type HeroRenderProps = Record<string, never>;

export interface HeroConfig {
  title?: ReactNode;
  description?: ReactNode;
  cta?: { label: string; href: string };
  left?: ReactNode | ((props: HeroRenderProps) => ReactNode);
  right?: ReactNode;
}

export interface FeatureConfig {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface HomepageConfig {
  hero?: HeroConfig;
  features?: FeatureConfig[];
}

/** @deprecated Configure colors in CSS and color mode through Fumadocs RootProvider. */
export interface ThemeConfig {
  /** @deprecated Set Fumadocs theme variables in your CSS instead. */
  primaryColor?: string;
  /** @deprecated Configure Fumadocs RootProvider instead. */
  darkMode?: boolean;
}

/** @deprecated Configure internationalization through Fumadocs directly. */
export interface I18nConfig {
  defaultLanguage: string;
  languages: string[];
}

export interface SocialLink {
  icon: ReactNode;
  href: string;
  label: string;
}

export interface FooterConfig {
  links?: NavLink[];
  socials?: SocialLink[];
}

export interface OnedocsConfig {
  title: string;
  description?: string;
  logo?: string | { light: string; dark: string };
  icon?: string | { light: string; dark: string };
  nav?: {
    links?: NavLink[];
    github?: string;
  };
  footer?: FooterConfig;
  homepage?: HomepageConfig;
  /** @deprecated Set the content directory in source.config.ts with defineDocs. */
  docs?: {
    /** @deprecated Pass dir to defineDocs in source.config.ts instead. */
    dir?: string;
  };
  /** @deprecated Configure CSS theme variables and Fumadocs RootProvider instead. */
  theme?: ThemeConfig;
  /** @deprecated Configure internationalization through Fumadocs directly. */
  i18n?: I18nConfig;
}

export function defineConfig(config: OnedocsConfig): OnedocsConfig {
  return { ...config };
}
