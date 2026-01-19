import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";

interface InstallBlockProps {
  title?: string;
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
      {title && (
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-fd-muted-foreground mb-6 text-balance">{description}</p>
      )}
      <Tabs groupId="pm" items={["npm", "yarn", "pnpm", "bun"]} className="!mb-0">
        <Tab value="npm">
          <pre className="block rounded bg-fd-secondary px-3 py-2 text-sm">
            <code>npm i {packageName}</code>
          </pre>
        </Tab>
        <Tab value="yarn">
          <pre className="block rounded bg-fd-secondary px-3 py-2 text-sm">
            <code>yarn add {packageName}</code>
          </pre>
        </Tab>
        <Tab value="pnpm">
          <pre className="block rounded bg-fd-secondary px-3 py-2 text-sm">
            <code>pnpm add {packageName}</code>
          </pre>
        </Tab>
        <Tab value="bun">
          <pre className="block rounded bg-fd-secondary px-3 py-2 text-sm">
            <code>bun add {packageName}</code>
          </pre>
        </Tab>
      </Tabs>
      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
