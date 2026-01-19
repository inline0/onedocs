import { RootProvider } from "fumadocs-ui/provider/tanstack";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import "../app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Onedocs" },
    ],
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
            __html: `
              .dark *, .dark *::before, .dark *::after { border-color: hsl(0 0% 20%) }
              @media (prefers-color-scheme: dark) {
                html:not(.light) *, html:not(.light) *::before, html:not(.light) *::after { border-color: hsl(0 0% 20%) }
              }
            `,
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
