import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { FontHead } from "./font-head.tsx"

describe("FontHead", () => {
  it("preloads and quotes a custom font path", () => {
    const html = renderToStaticMarkup(
      <FontHead fontPath="/fonts/custom.woff2" />
    )
    expect(html).toContain('href="/fonts/custom.woff2"')
    expect(html).toContain('src: url("/fonts/custom.woff2")')
  })

  it("does not let a font path close the style element", () => {
    const html = renderToStaticMarkup(
      <FontHead fontPath="</style><script>alert(1)</script>" />
    )
    expect(html).not.toContain("</style><script>")
    expect(html.match(/<\/style>/g)).toHaveLength(1)
  })
})
