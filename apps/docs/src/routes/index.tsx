import { HomePage, CTASection, highlightInstallCommands } from "onedocs";
import { createFileRoute } from "@tanstack/react-router";
import config from "../../onedocs.config";

export const Route = createFileRoute("/")({
  loader: async () => {
    const installCommands = await highlightInstallCommands("onedocs");
    return { installCommands };
  },
  component: Home,
});

function Home() {
  const { installCommands } = Route.useLoaderData();
  return (
    <HomePage config={config} installCommands={installCommands}>
      <CTASection
        title="Ready to get started?"
        description="Check out the documentation to learn more."
        cta={{ label: "Go to Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
