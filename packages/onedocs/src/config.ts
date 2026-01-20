import type { ReactNode } from "react";
import type { HighlightedInstallCommands } from "./components/install-block";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroRenderProps {
  installCommands?: HighlightedInstallCommands;
}

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

export interface ThemeConfig {
  primaryColor?: string;
  darkMode?: boolean;
}

export interface I18nConfig {
  defaultLanguage: string;
  languages: string[];
}

export interface OnedocsConfig {
  title: string;
  description?: string;
  logo?: string | { light: string; dark: string };
  icon?: string;
  nav?: {
    links?: NavLink[];
    github?: string;
  };
  homepage?: HomepageConfig;
  docs?: {
    dir?: string;
  };
  theme?: ThemeConfig;
  i18n?: I18nConfig;
}

export function defineConfig(config: OnedocsConfig): OnedocsConfig {
  return {
    docs: { dir: "content/docs" },
    theme: { darkMode: true },
    ...config,
  };
}
