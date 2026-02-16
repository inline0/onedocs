import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home";
import type { OnedocsConfig } from "../config";
import { createBaseOptions } from "./shared";
import { InstallBlock } from "../components/install-block";
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
  packageName?: string;
  children?: React.ReactNode;
}

export function HomePage({ config, packageName, children }: HomePageProps) {
  const { homepage } = config;
  const heroLeft = homepage?.hero?.left;
  const heroRight = homepage?.hero?.right;
  const currentYear = new Date().getFullYear();

  const renderedHeroLeft = typeof heroLeft === 'function'
    ? heroLeft({})
    : heroLeft;

  return (
    <HomeLayout config={config}>
      <main className="flex-1 flex flex-col min-h-[calc(100vh-var(--fd-nav-height))]">
        <div className="flex-1 flex flex-col relative mx-auto w-full max-w-(--fd-layout-width)">
          <div className="absolute inset-0 border-x pointer-events-none" />
          <div className="relative">
            <section id="hero">
              <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-2 px-6 py-8 lg:px-16 lg:py-12 xl:px-20 xl:py-16">
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
                      <div className="flex flex-wrap items-end gap-x-8 gap-y-6 mt-4 w-full">
                        {packageName && (
                          <div className="flex-1">
                            <InstallBlock packageName={packageName} />
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
                    <div className="flex h-full items-center px-6 py-8 lg:px-16 lg:py-12 xl:px-20 xl:py-16">
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
                        className="flex flex-col gap-y-2 items-start justify-start p-8 transition-colors hover:bg-fd-secondary/20 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
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
          <div className="border-x border-t px-6 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-fd-muted-foreground">
              © {currentYear} {config.title}
            </p>
            <div className="flex items-center gap-4">
              {config.footer?.links && config.footer.links.length > 0 && (
                <div className="flex items-center gap-4">
                  {config.footer.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              {config.footer?.socials && config.footer.socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {config.footer.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-fd-muted-foreground transition-colors hover:text-fd-foreground [&_svg]:size-4"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </footer>
      </main>
    </HomeLayout>
  );
}
