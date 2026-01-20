import { HomePage, CTASection } from 'onedocs-next';
import config from '../../onedocs.config';

export default function Home() {
  return (
    <HomePage config={config} packageName="onedocs-next">
      <CTASection
        title="Ready to get started?"
        description="Check out the documentation to learn more."
        cta={{ label: "Read the Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
