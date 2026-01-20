import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { FontHead } from "onedocs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onedocs",
  description: "Zero-config documentation for Next.js + Fumadocs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FontHead />
      </head>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
