import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import type { OnedocsConfig } from "../config";
import { createBaseOptions } from "./shared";

interface HomeLayoutProps {
  config: OnedocsConfig;
  children: ReactNode;
}

export function HomeLayout({ config, children }: HomeLayoutProps) {
  return (
    <FumaHomeLayout {...createBaseOptions(config)}>{children}</FumaHomeLayout>
  );
}

interface HeroProps {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}

export function Hero({ title, description, cta }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          {description}
        </p>
      )}
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          {cta.label}
        </a>
      )}
    </div>
  );
}
