import { HomeLayout, InstallBlock } from "onedocs";
import { createFileRoute } from "@tanstack/react-router";
import config from "../../onedocs.config";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { homepage } = config;

  return (
    <HomeLayout config={config}>
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <InstallBlock
              title={homepage?.hero?.title ?? config.title}
              description={homepage?.hero?.description ?? config.description}
              packageName="onedocs"
            />
          </div>
          <div className="flex flex-col justify-end">
            <a
              href={homepage?.hero?.cta?.href ?? "/docs"}
              className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90"
            >
              {homepage?.hero?.cta?.label ?? "Get Started"}
            </a>
          </div>
        </div>
        {homepage?.features && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-12">
            {homepage.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-fd-card p-6"
              >
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-fd-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </HomeLayout>
  );
}
