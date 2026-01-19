import { RootProvider } from "fumadocs-ui/provider/tanstack";
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
    ],
    links: config.icon ? [{ rel: "icon", href: config.icon }] : [],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootProvider>
      <Outlet />
    </RootProvider>
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
