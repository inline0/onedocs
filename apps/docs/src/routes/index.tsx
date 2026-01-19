import { HomeLayout, InstallBlock } from "onedocs";
import { createFileRoute } from "@tanstack/react-router";
import config from "../../onedocs.config";
import {
  Package,
  Settings,
  FileText,
  Search,
  Moon,
  Code,
  Zap,
  Puzzle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  package: Package,
  settings: Settings,
  "file-text": FileText,
  search: Search,
  moon: Moon,
  code: Code,
  zap: Zap,
  puzzle: Puzzle,
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { homepage } = config;

  return (
    <HomeLayout config={config}>
      <main className="flex-1">
        <section id="hero">
          <div className="relative mx-auto container max-w-(--fd-layout-width)">
            <div className="relative w-full border-x">
              <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-2 p-6 lg:p-12">
                  <h1 className="text-left text-4xl font-semibold leading-tight text-fd-foreground sm:text-5xl md:text-6xl tracking-tighter">
                    {homepage?.hero?.title ?? config.title}
                  </h1>
                  <p className="text-left max-w-xl leading-normal text-fd-muted-foreground sm:text-lg sm:leading-normal text-balance mt-4">
                    {homepage?.hero?.description ?? config.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mt-8 w-full">
                    <div className="flex-1">
                      <InstallBlock packageName="onedocs" />
                    </div>
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
            </div>
          </div>
        </section>

        {homepage?.features && (
          <section id="features">
            <div className="relative mx-auto container max-w-(--fd-layout-width)">
              <div className="border-x border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {homepage.features.map((feature, index) => {
                    const Icon = feature.icon ? iconMap[feature.icon] : null;
                    return (
                      <div
                        key={feature.title}
                        className={`flex flex-col gap-y-2 items-start justify-start py-8 px-6 border-b transition-colors hover:bg-fd-secondary/20 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 ${index >= homepage.features.length - 4 ? "lg:border-b-0" : ""} ${index >= homepage.features.length - 2 ? "sm:border-b-0" : ""} ${index === homepage.features.length - 1 ? "border-b-0" : ""}`}
                      >
                        {Icon && (
                          <div className="bg-fd-primary/10 p-2 rounded-lg mb-2">
                            <Icon className="h-5 w-5 text-fd-primary" />
                          </div>
                        )}
                        <h3 className="text-base font-medium text-fd-card-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-fd-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="relative mx-auto container max-w-(--fd-layout-width)">
          <div className="border-x border-t h-16" />
        </div>
      </main>
    </HomeLayout>
  );
}
