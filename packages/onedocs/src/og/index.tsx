import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogImageSize = {
  width: 1200,
  height: 630,
}

export const ogImageContentType = "image/png"

/**
 * A public asset as a data URI and bytes, with optional dimensions.
 */
export type LoadedFile = {
  data: string
  buffer: Buffer
  width?: number
  height?: number
}

/**
 * Read an asset relative to the consumer site public directory.
 *
 * @param relativePath - Asset path within public.
 * @returns The file bytes and data URI, with SVG dimensions when present.
 */
export async function loadPublicFile(
  relativePath: string
): Promise<LoadedFile> {
  const absolutePath = join(process.cwd(), "public", relativePath)
  const buffer = await readFile(absolutePath)
  const base64 = buffer.toString("base64")
  const ext = relativePath.split(".").pop()?.toLowerCase()

  let mimeType = "application/octet-stream"
  if (ext === "svg") mimeType = "image/svg+xml"
  else if (ext === "png") mimeType = "image/png"
  else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg"
  else if (ext === "woff2") mimeType = "font/woff2"
  else if (ext === "woff") mimeType = "font/woff"
  else if (ext === "ttf") mimeType = "font/ttf"

  const result: LoadedFile = {
    data: `data:${mimeType};base64,${base64}`,
    buffer,
  }

  // Extract dimensions from SVG
  if (ext === "svg") {
    const svgContent = buffer.toString("utf-8")
    const widthMatch = svgContent.match(/width="(\d+)"/)
    const heightMatch = svgContent.match(/height="(\d+)"/)
    if (widthMatch?.[1]) result.width = parseInt(widthMatch[1], 10)
    if (heightMatch?.[1]) result.height = parseInt(heightMatch[1], 10)
  }

  return result
}

/**
 * Read a public font into an ArrayBuffer for image generation.
 *
 * @param relativePath - Font path relative to public.
 * @returns The font bytes.
 */
export async function loadInterFont(
  relativePath: string = "fonts/Inter-Medium.ttf"
): Promise<ArrayBuffer> {
  const { buffer } = await loadPublicFile(relativePath)
  return new Uint8Array(buffer).buffer
}

/**
 * A logo asset with dimensions for Open Graph image layout.
 */
export type OGImageLogo = LoadedFile & {
  width: number
  height: number
}

/**
 * Render a centered logo on a black Open Graph image.
 *
 * @param logo - Logo data and dimensions.
 * @returns The Open Graph image response.
 */
export async function createRootOGImage(
  logo: OGImageLogo
): Promise<ImageResponse> {
  const maxWidth = ogImageSize.width * 0.6
  const scale = Math.min(1, maxWidth / logo.width)
  const displayWidth = Math.round(logo.width * scale)
  const displayHeight = Math.round(logo.height * scale)

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
    >
      <img src={logo.data} width={displayWidth} height={displayHeight} alt="" />
    </div>,
    ogImageSize
  )
}

/**
 * Render a documentation title and logo as an Open Graph image.
 *
 * @param title - The page title.
 * @param logo - Logo data and dimensions.
 * @param font - Optional font bytes for the title.
 * @returns The Open Graph image response.
 */
export async function createDocsOGImage(
  title: string,
  logo: OGImageLogo,
  font?: ArrayBuffer
): Promise<ImageResponse> {
  const targetHeight = 40
  const scale = targetHeight / logo.height
  const displayWidth = Math.round(logo.width * scale)
  const displayHeight = targetHeight

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        padding: 60,
      }}
    >
      <div style={{ display: "flex" }}>
        <img
          src={logo.data}
          width={displayWidth}
          height={displayHeight}
          alt=""
        />
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 500,
          color: "#ffffff",
          lineHeight: 1.1,
          fontFamily: font ? "Inter" : "system-ui",
        }}
      >
        {title}
      </div>
    </div>,
    {
      ...ogImageSize,
      fonts: font
        ? [
            {
              name: "Inter",
              data: font,
              style: "normal",
              weight: 500,
            },
          ]
        : undefined,
    }
  )
}

export { ImageResponse } from "next/og"
