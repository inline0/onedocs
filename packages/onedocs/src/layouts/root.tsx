import { RootProvider } from "fumadocs-ui/provider/tanstack";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return <RootProvider>{children}</RootProvider>;
}
