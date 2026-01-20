import { RootLayout } from "onedocs";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import "../app.css";
import config from "../../onedocs.config";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
      {
        name: "description",
        content: "Zero-config documentation for TanStack Start + Fumadocs",
      },
      {
        name: "og:description",
        content: "Zero-config documentation for TanStack Start + Fumadocs",
      },
      { name: "apple-mobile-web-app-title", content: "Onedocs" },
    ],
    links: [
      { rel: "icon", href: config.icon ?? "/icon.png" },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--color-fd-border:hsla(0,0%,80%,50%);--color-fd-primary:hsl(0,0%,9%)}.dark{--color-fd-border:hsla(0,0%,40%,20%);--color-fd-primary:hsl(0,0%,98%)}@media(prefers-color-scheme:dark){:root:not(.light){--color-fd-border:hsla(0,0%,40%,20%);--color-fd-primary:hsl(0,0%,98%)}}@layer base{*,::before,::after{border-color:var(--color-fd-border)}}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
