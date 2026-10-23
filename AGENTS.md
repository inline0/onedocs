# OneDocs development

Use `AGENTS.md` as the only repository instruction filename, including nested
guides. Keep the guidance here and do not add forwarding aliases.

OneDocs is a Next.js and Fumadocs library. Preserve its public `onedocs` package
name, exports, peer dependency compatibility and runtime support for Node.js
20.9 or newer. The repository itself uses Node.js 26.12.0 and pnpm 12.14.0.

Use [the API reference](docs/api-reference.md) and
[configuration guide](docs/configuration.md) when editing public behavior.
The root [README](README.md#development) lists the supported pnpm commands.

## Workspace

- `packages/onedocs` contains the published library, runtime tests and public CSS.
- `packages/tsconfig` contains private shared TypeScript configuration.
- `scripts` contains native TypeScript quality and packaging checks.
- `docs` contains the portable Markdown documentation: six pages and one nav.

Use ES modules, explicit relative `.ts`/`.tsx` imports and `workspace:*` for
internal dependencies. Pin external development dependencies in the root pnpm
catalog and consume them with `catalog:`. Every package needs a description,
README and matching entry in the root README package table.

## Commands and style

Run `pnpm run setup` after switching to the pinned Node version. Use `pnpm check`
for formatting, linting, workspace/docs audits, types, tests and builds. Run
`pnpm verify` before shipping; it also checks the tarball and installs it in a
temporary consumer. `pnpm format` and `pnpm lint:fix` apply supported fixes.

Follow the shared Sleekos formatting and correctness rules: 80 columns, double
quotes, no semicolons, ES5 trailing commas, type-aware Oxlint and documented
exports. The local documentation lint plugin is adapted from
[`inline0/sleekos`](https://github.com/inline0/sleekos).

Do not replace Next.js/Fumadocs with another framework or add unused packages
just to expand the workspace. Keep generated `dist`, package LICENSE copies,
dependencies, coverage and temporary test consumers out of git. Stop any
processes you start and remove temporary workspaces when finished.

## Releases

Record changes in `CHANGELOG.md`. Keep GitHub release titles equal to their tag
and release bodies to this single sentence, substituting the actual tag:

> See [CHANGELOG.md](https://github.com/inline0/onedocs/blob/main/CHANGELOG.md) for the full release notes for `vX.Y.Z`.

The shared `.github/workflows/release-format.yml` enforces this metadata rule.
Publishing remains a separate explicit release operation after `pnpm verify`.
