interface LogoProps {
  light: string
  dark: string
  alt?: string
  className?: string
}

/**
 * Render a logo with light and dark theme variants.
 *
 * @param props - Component content and presentation options.
 * @returns The rendered component.
 */
export function Logo({ light, dark, alt = "Logo", className }: LogoProps) {
  return (
    <>
      <img src={light} alt={alt} className={`dark:hidden ${className ?? ""}`} />
      <img
        src={dark}
        alt={alt}
        className={`hidden dark:block ${className ?? ""}`}
      />
    </>
  )
}
