import type { ReactNode } from "react";

interface CTASectionProps {
  title: string;
  description?: string;
  cta: {
    label: string;
    href: string;
  };
  children?: ReactNode;
}

export function CTASection({ title, description, cta, children }: CTASectionProps) {
  return (
    <section className="border-b">
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <h2 className="text-2xl font-semibold text-fd-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-fd-muted-foreground max-w-md">
            {description}
          </p>
        )}
        <a
          href={cta.href}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90"
        >
          {cta.label}
        </a>
        {children}
      </div>
    </section>
  );
}
