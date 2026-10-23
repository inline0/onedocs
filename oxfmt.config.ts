import { defineConfig } from "oxfmt"

export default defineConfig({
  printWidth: 80,
  semi: false,
  singleQuote: false,
  trailingComma: "es5",
  useTabs: false,
  sortPackageJson: false,
  sortImports: { newlinesBetween: false },
  ignorePatterns: [
    "**/node_modules/",
    "**/dist/",
    "**/coverage/",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
  ],
})
