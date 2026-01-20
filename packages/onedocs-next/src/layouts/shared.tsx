import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import type { OnedocsConfig } from "../config";
import { Logo } from "../components/logo";
import { GitHubIcon } from "../components/icons";

export function createBaseOptions(config: OnedocsConfig): BaseLayoutProps {
  const links: LinkItemType[] = (config.nav?.links ?? []).map((link) => ({
    type: "main" as const,
    text: link.label,
    url: link.href,
  }));

  if (config.nav?.github) {
    links.push({
      type: "icon",
      text: "GitHub",
      icon: <GitHubIcon />,
      url: `https://github.com/${config.nav.github}`,
    });
  }

  const navTitle = config.logo
    ? typeof config.logo === "string"
      ? <img src={config.logo} alt={config.title} className="h-6" />
      : <Logo light={config.logo.light} dark={config.logo.dark} alt={config.title} className="h-6" />
    : config.title;

  return {
    nav: {
      title: navTitle,
    },
    links,
  };
}
