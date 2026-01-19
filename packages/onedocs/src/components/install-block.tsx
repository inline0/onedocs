import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

interface InstallBlockProps {
  title: string;
  description?: string;
  packageName: string;
  children?: ReactNode;
}

export function InstallBlock({
  title,
  description,
  packageName,
  children,
}: InstallBlockProps) {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="text-fd-muted-foreground mb-6 text-balance">{description}</p>
      )}
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
      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
