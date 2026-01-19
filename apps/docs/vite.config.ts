import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as MdxConfig from "./source.config";

export default defineConfig({
  plugins: [
    mdx(MdxConfig),
    tsconfigPaths(),
    tailwindcss(),
    nitro(),
    tanstackStart(),
    react(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "127.0.0.1",
  },
  preview: {
    host: "127.0.0.1",
  },
  ssr: {
    noExternal: ["fumadocs-ui", "fumadocs-core", "fumadocs-mdx", "onedocs"],
  },
});
