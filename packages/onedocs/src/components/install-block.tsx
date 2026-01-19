import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

interface InstallBlockProps {
  title: string;
  description?: string;
  packageName: string;
  ctaLabel?: string;
  ctaHref?: string;
  children?: ReactNode;
}

export function InstallBlock({
  title,
  description, 
  packageName, 
  ctaLabel = "Get Started",
  ctaHref = "/docs",
  children,
}: InstallBlockProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="flex flex-col justify-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mb-8 text-lg text-fd-muted-foreground">{description}</p>
        )}
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <Tabs groupId="pm" items={["npm", "yarn", "pnpm", "bun"]} className="!mb-0">
              <Tab value="npm">
                <code className="block rounded bg-fd-secondary px-3 py-2 text-sm">
                  npm i {packageName}
                </code>
              </Tab>
              <Tab value="yarn">
                <code className="block rounded bg-fd-secondary px-3 py-2 text-sm">
                  yarn add {packageName}
                </code>
              </Tab>
              <Tab value="pnpm">
                <code className="block rounded bg-fd-secondary px-3 py-2 text-sm">
                  pnpm add {packageName}
                </code>
              </Tab>
              <Tab value="bun">
                <code className="block rounded bg-fd-secondary px-3 py-2 text-sm">
                  bun add {packageName}
                </code>
              </Tab>
            </Tabs>
          </div>
          <a
            href={ctaHref}
            className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
      {children && (
        <div className="flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
