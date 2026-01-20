import { HomePage, CTASection } from 'onedocs';
import config from '../../onedocs.config';

export default function Home() {
  return (
    <HomePage config={config} packageName="onedocs">
      <CTASection
        title="Ready to get started?"
        description="Check out the documentation to learn more."
        cta={{ label: "Read the Docs", href: "/docs" }}
      />
    </HomePage>
  );
}
