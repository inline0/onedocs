export function FontHead({ fontPath = "/fonts/InterVariable.woff2" }: { fontPath?: string }) {
  return (
    <>
      <link
        rel="preload"
        href={fontPath}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('${fontPath}') format('woff2');
}

:root {
  --font-inter: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
}

body {
  font-family: var(--font-inter);
  font-feature-settings: "calt" 1, "cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1, "ss08" 1;
}

h1, h2, h3, h4, h5, h6 {
  font-feature-settings: "calt" 1, "cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1, "ss07" 1, "ss08" 1, "dlig" 1;
}
          `.trim(),
        }}
      />
    </>
  );
}
