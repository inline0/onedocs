import type { ReactNode } from "react"

/**
 * A labeled navigation destination.
 */
export interface NavLink {
  label: string
  href: string
}

/**
 * Properties supplied to a custom hero renderer.
 */
export type HeroRenderProps = Record<string, never>

/**
 * Content and custom slots for the home page hero.
 */
export interface HeroConfig {
  title?: ReactNode
  description?: ReactNode
  cta?: { label: string; href: string }
  left?: ReactNode | ((props: HeroRenderProps) => ReactNode)
  right?: ReactNode
}

/**
 * A feature displayed in the home page grid.
 */
export interface FeatureConfig {
  title: string
  description: string
  icon?: ReactNode
}

/**
 * Hero and feature content for the home page.
 */
export interface HomepageConfig {
  hero?: HeroConfig
  features?: FeatureConfig[]
}

/**
 * @deprecated Configure colors in CSS and Fumadocs RootProvider.
 */
export interface ThemeConfig {
  /** @deprecated Set Fumadocs theme variables in your CSS instead. */
  primaryColor?: string
  /** @deprecated Configure Fumadocs RootProvider instead. */
  darkMode?: boolean
}

/** @deprecated Configure internationalization through Fumadocs directly. */
export interface I18nConfig {
  defaultLanguage: string
  languages: string[]
}

/**
 * An accessible social link with its icon.
 */
export interface SocialLink {
  icon: ReactNode
  href: string
  label: string
}

/**
 * Navigation and social links displayed in the footer.
 */
export interface FooterConfig {
  links?: NavLink[]
  socials?: SocialLink[]
}

/**
 * Shared branding, navigation and home page configuration.
 */
export interface OnedocsConfig {
  title: string
  description?: string
  logo?: string | { light: string; dark: string }
  icon?: string | { light: string; dark: string }
  nav?: {
    links?: NavLink[]
    github?: string
  }
  footer?: FooterConfig
  homepage?: HomepageConfig
  /**
   * @deprecated Set the content directory with defineDocs in source.config.ts.
   */
  docs?: {
    /** @deprecated Pass dir to defineDocs in source.config.ts instead. */
    dir?: string
  }
  /**
   * @deprecated Configure CSS variables and Fumadocs RootProvider instead.
   */
  theme?: ThemeConfig
  /** @deprecated Configure internationalization through Fumadocs directly. */
  i18n?: I18nConfig
}

/**
 * Return a shallow copy of the site configuration.
 *
 * @param config - Site configuration.
 * @returns The copied configuration.
 */
export function defineConfig(config: OnedocsConfig): OnedocsConfig {
  return { ...config }
}
