import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
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
  commands: HighlightedInstallCommands;
  children?: ReactNode;
}

export function InstallBlock({
  title,
  description,
  commands,
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
        <Tab value="npm" className="!p-0 !py-0 !px-0">
          <div dangerouslySetInnerHTML={{ __html: commands.npm }} />
        </Tab>
        <Tab value="yarn" className="!p-0 !py-0 !px-0">
          <div dangerouslySetInnerHTML={{ __html: commands.yarn }} />
        </Tab>
        <Tab value="pnpm" className="!p-0 !py-0 !px-0">
          <div dangerouslySetInnerHTML={{ __html: commands.pnpm }} />
        </Tab>
        <Tab value="bun" className="!p-0 !py-0 !px-0">
          <div dangerouslySetInnerHTML={{ __html: commands.bun }} />
        </Tab>
      </Tabs>
      {children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}
