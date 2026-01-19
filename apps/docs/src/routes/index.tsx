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
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <InstallBlock
          title={homepage?.hero?.title ?? config.title}
          description={homepage?.hero?.description ?? config.description}
          packageName="onedocs"
          ctaLabel={homepage?.hero?.cta?.label ?? "Get Started"}
          ctaHref={homepage?.hero?.cta?.href ?? "/docs"}
        />
        {homepage?.features && (
          <div className="grid gap-6 md:grid-cols-3 py-12">
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
