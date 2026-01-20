import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home";
import type { OnedocsConfig } from "../config";
import { createBaseOptions } from "./shared";
import { InstallBlock, type HighlightedInstallCommands } from "../components/install-block";
import { Button } from "../components/button";

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
  installCommands?: HighlightedInstallCommands;
  children?: React.ReactNode;
}

export function HomePage({ config, installCommands, children }: HomePageProps) {
  const { homepage } = config;
  const heroLeft = homepage?.hero?.left;
  const heroRight = homepage?.hero?.right;
  const currentYear = new Date().getFullYear();

  const renderedHeroLeft = typeof heroLeft === 'function'
    ? heroLeft({ installCommands })
    : heroLeft;

  return (
    <HomeLayout config={config}>
      <main className="flex-1 flex flex-col min-h-[calc(100vh-var(--fd-nav-height))]">
        <div className="flex-1 flex flex-col relative mx-auto w-full max-w-(--fd-layout-width)">
          <div className="absolute inset-0 border-x pointer-events-none" />
          <div className="relative">
            <section id="hero">
              <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-2 p-6 lg:p-12">
                  {renderedHeroLeft ? (
                    renderedHeroLeft
                  ) : (
                    <>
                      <h1 className="text-left text-4xl font-medium leading-tight text-fd-foreground sm:text-5xl">
                        {homepage?.hero?.title ?? config.title}
                      </h1>
                      <p className="text-left max-w-xl leading-normal text-fd-muted-foreground sm:text-lg sm:leading-normal text-balance mt-4">
                        {homepage?.hero?.description ?? config.description}
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-x-8 gap-y-4 mt-4 w-full">
                        {installCommands && (
                          <div className="flex-1">
                            <InstallBlock commands={installCommands} />
                          </div>
                        )}
                        <Button href={homepage?.hero?.cta?.href ?? "/docs"}>
                          {homepage?.hero?.cta?.label ?? "Get Started"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="lg:col-span-2 hidden lg:block">
                  {heroRight ? (
                    <div className="flex h-full items-center p-6 lg:p-12">
                      {heroRight}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            {homepage?.features && homepage.features.length > 0 && (
              <section id="features">
                <div className="border-y">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 [&>*]:border-b [&>*:nth-last-child(-n+1)]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-last-child(-n+4)]:border-b-0">
                    {homepage.features.map((feature) => (
                      <div
                        key={feature.title}
                        className="flex flex-col gap-y-2 items-start justify-start py-8 px-6 transition-colors hover:bg-fd-secondary/20 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
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
          {children && (
            <div className="flex-1 flex items-center justify-center">
              {children}
            </div>
          )}
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
