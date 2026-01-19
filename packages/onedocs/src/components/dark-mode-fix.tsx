export function DarkModeFix() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.dark *, .dark *::before, .dark *::after { border-color: hsl(0 0% 20%) }
@media (prefers-color-scheme: dark) {
  html:not(.light) *, html:not(.light) *::before, html:not(.light) *::after { border-color: hsl(0 0% 20%) }
}`,
      }}
    />
  );
}
