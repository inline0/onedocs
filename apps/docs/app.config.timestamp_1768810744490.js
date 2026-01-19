var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import mdx from "fumadocs-mdx/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// source.config.ts
var source_config_exports = {};
__export(source_config_exports, {
  docs: () => docs
});
import { defineDocs } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/docs"
});

// app.config.ts
var app_config_default = defineConfig({
  vite: {
    plugins: [mdx(source_config_exports), tsconfigPaths()]
  }
});
export {
  app_config_default as default
};
