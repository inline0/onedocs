import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
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
        <Tab value="npm" className="!py-0 !px-4">
          <DynamicCodeBlock lang="bash" code={`npm i ${packageName}`} codeblock={{ className: "!my-0" }} />
        </Tab>
        <Tab value="yarn" className="!py-0 !px-4">
          <DynamicCodeBlock lang="bash" code={`yarn add ${packageName}`} codeblock={{ className: "!my-0" }} />
        </Tab>
        <Tab value="pnpm" className="!py-0 !px-4">
          <DynamicCodeBlock lang="bash" code={`pnpm add ${packageName}`} codeblock={{ className: "!my-0" }} />
        </Tab>
        <Tab value="bun" className="!py-0 !px-4">
          <DynamicCodeBlock lang="bash" code={`bun add ${packageName}`} codeblock={{ className: "!my-0" }} />
        </Tab>
      </Tabs>
      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
