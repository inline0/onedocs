# OneDocs

Read [AGENTS.md](AGENTS.md) for repository conventions, quality checks and
release rules. It is the shared instruction source for coding agents.

OneDocs remains a Next.js/Fumadocs library published as `onedocs`, with source in
`packages/onedocs`, shared TypeScript configuration in `packages/tsconfig`,
portable documentation in `docs`, and native TypeScript checks in `scripts`.
The root [README](README.md#development) lists the supported pnpm commands.

Use [the API reference](docs/api-reference.md) and
[configuration guide](docs/configuration.md) when editing public behavior.
Preserve the package exports, documented peer versions and Node.js 20.9 runtime
support. Development uses the versions in `.nvmrc` and `packageManager`.
