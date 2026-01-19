import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/config.ts",
    "src/components/index.ts",
    "src/components/install-block.tsx",
    "src/source/index.ts",
    "src/llms/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@tanstack/react-router",
    "@tanstack/start",
  ],
});
