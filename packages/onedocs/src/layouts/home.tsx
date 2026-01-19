import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home";
import type { OnedocsConfig } from "../config";
import { createBaseOptions } from "./shared";
import { InstallBlock } from "../components/install-block";

interface HomeLayoutProps {
  config: OnedocsConfig;
  children?: React.ReactNode;
}

export function HomeLayout({ config, children }: HomeLayoutProps) {
  return (
    <FumaHomeLayout {...createBaseOptions(config)}>{children}</FumaHomeLayout>
  );
}

interface HomePageProps {
  config: OnedocsConfig;
  packageName?: string;
}

export function HomePage({ config, packageName }: HomePageProps) {
  const { homepage } = config;
  const currentYear = new Date().getFullYear();

  return (
    <HomeLayout config={config}>
      <main className="flex-1 flex flex-col min-h-[calc(100vh-var(--fd-nav-height))]">
        <div className="flex-1 relative mx-auto w-full max-w-(--fd-layout-width)">
          <div className="absolute inset-0 border-x pointer-events-none" />
          <div className="relative">
            <section id="hero">
              <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-2 p-6 lg:p-12">
                  <h1 className="text-left text-4xl font-semibold leading-tight text-fd-foreground sm:text-5xl md:text-6xl tracking-tight">
                    {homepage?.hero?.title ?? config.title}
                  </h1>
                  <p className="text-left max-w-xl leading-normal text-fd-muted-foreground sm:text-lg sm:leading-normal text-balance mt-4">
                    {homepage?.hero?.description ?? config.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mt-8 w-full">
                    {packageName && (
                      <div className="flex-1">
                        <InstallBlock packageName={packageName} />
                      </div>
                    )}
                    <a
                      href={homepage?.hero?.cta?.href ?? "/docs"}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90 whitespace-nowrap"
                    >
                      {homepage?.hero?.cta?.label ?? "Get Started"}
                    </a>
                  </div>
                </div>
                <div className="lg:col-span-2 hidden lg:block" />
              </div>
            </section>

            {homepage?.features && homepage.features.length > 0 && (
              <section id="features">
                <div className="border-y">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {homepage.features.map((feature, index) => (
                      <div
                        key={feature.title}
                        className={`flex flex-col gap-y-2 items-start justify-start py-8 px-6 transition-colors hover:bg-fd-secondary/20 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 ${index < homepage.features!.length - 4 ? "lg:border-b" : ""} ${index < homepage.features!.length - 2 ? "sm:max-lg:border-b" : ""} ${index < homepage.features!.length - 1 ? "max-sm:border-b" : ""}`}
                      >
                        {feature.icon && (
                          <div className="bg-fd-primary/10 p-2 rounded-lg mb-2">
                            {feature.icon}
                          </div>
                        )}
                        <h3 className="text-base font-medium text-fd-card-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-fd-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="relative mx-auto w-full max-w-(--fd-layout-width)">
          <div className="border-x border-t px-6 py-4">
            <p className="text-sm text-fd-muted-foreground">
              © {currentYear} {config.title}
            </p>
          </div>
        </footer>
      </main>
    </HomeLayout>
  );
}
