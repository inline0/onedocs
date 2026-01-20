import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

export type LoadedFile = {
  data: string;
  buffer: Buffer;
  width?: number;
  height?: number;
};

export async function loadPublicFile(relativePath: string): Promise<LoadedFile> {
  const absolutePath = join(process.cwd(), "public", relativePath);
  const buffer = await readFile(absolutePath);
  const base64 = buffer.toString("base64");
  const ext = relativePath.split(".").pop()?.toLowerCase();

  let mimeType = "application/octet-stream";
  if (ext === "svg") mimeType = "image/svg+xml";
  else if (ext === "png") mimeType = "image/png";
  else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  else if (ext === "woff2") mimeType = "font/woff2";
  else if (ext === "woff") mimeType = "font/woff";
  else if (ext === "ttf") mimeType = "font/ttf";

  const result: LoadedFile = {
    data: `data:${mimeType};base64,${base64}`,
    buffer,
  };

  // Extract dimensions from SVG
  if (ext === "svg") {
    const svgContent = buffer.toString("utf-8");
    const widthMatch = svgContent.match(/width="(\d+)"/);
    const heightMatch = svgContent.match(/height="(\d+)"/);
    if (widthMatch?.[1]) result.width = parseInt(widthMatch[1], 10);
    if (heightMatch?.[1]) result.height = parseInt(heightMatch[1], 10);
  }

  return result;
}

export async function loadInterFont(
  relativePath: string = "fonts/Inter-Medium.ttf"
): Promise<ArrayBuffer> {
  const { buffer } = await loadPublicFile(relativePath);
  return new Uint8Array(buffer).buffer;
}

export type OGImageLogo = LoadedFile & {
  width: number;
  height: number;
};

export async function createRootOGImage(logo: OGImageLogo): Promise<ImageResponse> {
  const maxWidth = ogImageSize.width * 0.6;
  const scale = Math.min(1, maxWidth / logo.width);
  const displayWidth = Math.round(logo.width * scale);
  const displayHeight = Math.round(logo.height * scale);

  return new ImageResponse(
    (
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
        <img
          src={logo.data}
          width={displayWidth}
          height={displayHeight}
          alt=""
        />
      </div>
    ),
    ogImageSize
  );
}

export async function createDocsOGImage(
  title: string,
  logo: OGImageLogo,
  font?: ArrayBuffer
): Promise<ImageResponse> {
  const targetHeight = 40;
  const scale = targetHeight / logo.height;
  const displayWidth = Math.round(logo.width * scale);
  const displayHeight = targetHeight;

  return new ImageResponse(
    (
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
      </div>
    ),
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
  );
}

export { ImageResponse } from "next/og";
