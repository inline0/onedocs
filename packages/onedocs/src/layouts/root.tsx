import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { FrameworkProvider } from "fumadocs-core/framework";
import {
  Link,
  useParams,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <FrameworkProvider
      Link={FrameworkLink}
      usePathname={usePathname}
      useRouter={useFrameworkRouter}
      useParams={useFrameworkParams}
    >
      <RootProvider>{children}</RootProvider>
    </FrameworkProvider>
  );
}

function FrameworkLink({
  href,
  prefetch = true,
  ...props
}: React.ComponentProps<"a"> & { prefetch?: boolean }) {
  return (
    <a href={href ?? "#"} {...props}>
      {props.children}
    </a>
  );
}

function usePathname() {
  const { isLoading, pathname } = useRouterState({
    select: (state) => ({
      isLoading: state.isLoading,
      pathname: state.location.pathname,
    }),
  });
  const activePathname = useRef(pathname);

  return useMemo(() => {
    if (isLoading) return activePathname.current;
    activePathname.current = pathname;
    return pathname;
  }, [isLoading, pathname]);
}

function useFrameworkRouter() {
  const router = useRouter();

  return useMemo(
    () => ({
      push(url: string) {
        router.navigate({ href: url });
      },
      refresh() {
        router.invalidate();
      },
    }),
    [router],
  );
}

function useFrameworkParams() {
  return useParams({ strict: false });
}
