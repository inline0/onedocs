# @onedocs/tsconfig

Shared TypeScript configuration for OneDocs packages.

This private workspace package defines strict ES module defaults in `base.json`
and an ES2022 library build with declarations in `package-library.json`.
TypeScript rewrites explicit relative `.ts` and `.tsx` imports when emitting
JavaScript. The library build also normalizes declaration imports to `.js`, so
the published package can be consumed without TypeScript loaders or source files.

```json
{
  "extends": "@onedocs/tsconfig/package-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

Repository quality commands and contribution rules are documented in the
[root README](../../README.md#development) and [AGENTS.md](../../AGENTS.md).
