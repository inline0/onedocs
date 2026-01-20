import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { highlight } from "fumadocs-core/highlight";
import { renderToString } from "react-dom/server";
import type { ReactNode } from "react";

export interface HighlightedInstallCommands {
  npm: string;
  yarn: string;
  pnpm: string;
  bun: string;
}

export async function highlightInstallCommands(packageName: string): Promise<HighlightedInstallCommands> {
  const highlightCode = async (code: string) => {
    const rendered = await highlight(code, {
      lang: "bash",
      components: {
        pre: (props) => <Pre {...props} />,
      },
    });
    return renderToString(<CodeBlock className="!my-0 !border-0 !shadow-none">{rendered}</CodeBlock>);
  };

  const [npm, yarn, pnpm, bun] = await Promise.all([
    highlightCode(`npm i ${packageName}`),
    highlightCode(`yarn add ${packageName}`),
    highlightCode(`pnpm add ${packageName}`),
    highlightCode(`bun add ${packageName}`),
  ]);

  return { npm, yarn, pnpm, bun };
}

interface InstallBlockProps {
  title?: string;
  description?: string;
  packageName?: string;
  commands?: HighlightedInstallCommands;
  children?: ReactNode;
}

export function InstallBlock({
  title,
  description,
  packageName,
  commands,
  children,
}: InstallBlockProps) {
  if (!commands && !packageName) {
    return null;
  }

  const renderTab = (pm: "npm" | "yarn" | "pnpm" | "bun", cmd: string) => {
    if (commands) {
      return <div dangerouslySetInnerHTML={{ __html: commands[pm] }} />;
    }
    return (
      <DynamicCodeBlock lang="bash" code={cmd} />
    );
  };

  const pkg = packageName ?? "";

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
        <Tab value="npm" className="!p-0 !py-0 !px-0">
          {renderTab("npm", `npm i ${pkg}`)}
        </Tab>
        <Tab value="yarn" className="!p-0 !py-0 !px-0">
          {renderTab("yarn", `yarn add ${pkg}`)}
        </Tab>
        <Tab value="pnpm" className="!p-0 !py-0 !px-0">
          {renderTab("pnpm", `pnpm add ${pkg}`)}
        </Tab>
        <Tab value="bun" className="!p-0 !py-0 !px-0">
          {renderTab("bun", `bun add ${pkg}`)}
        </Tab>
      </Tabs>
      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
