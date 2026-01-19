import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function Button({ href, children, className = "" }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90 whitespace-nowrap ${className}`}
    >
      {children}
    </a>
  );
}
