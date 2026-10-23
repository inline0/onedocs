# Changelog

## Unreleased

### Changed

- Standardize development on Node.js 26.12.0, pnpm 12.14.0, catalog dependencies,
  Oxfmt, type-aware Oxlint and native TypeScript scripts.
- Refresh compatible Next.js, React and Fumadocs development dependencies while
  preserving the public package exports and Node.js 20.9 runtime support.
- Add workspace documentation audits, package validation, consumer verification
  and the shared GitHub release format.

### Fixed

- Emit explicit relative JavaScript imports in production files and declarations.
- Preserve source data inference with the current Fumadocs page discriminants.
- Render custom font URLs as quoted CSS inside React-managed style content.
