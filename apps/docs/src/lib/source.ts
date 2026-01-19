// Server-side source loader - only import on server
export async function getSource() {
  const { loader } = await import("fumadocs-core/source");
  const { docs } = await import("../../.source/server");

  return loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource(),
  });
}
