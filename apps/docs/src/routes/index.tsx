import { HomePage, CTASection } from "onedocs";
import { createFileRoute } from "@tanstack/react-router";
import config from "../../onedocs.config.tsx";

export const Route = createFileRoute("/")({"component": Home,
});

function Home() {
  return (
    <HomePage config={config} packageName="onedocs">
      <CTASection
        title="Ready to get started?"
        description="Check out the documentation to learn more."
        cta={{ label: "Go to Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
