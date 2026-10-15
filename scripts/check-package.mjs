import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const [packed] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: new URL("../packages/onedocs", import.meta.url),
    encoding: "utf8",
  }),
);

for (const path of [
  "README.md",
  "LICENSE",
  "dist/index.js",
  "dist/index.d.ts",
  "src/css/preset.css",
]) {
  assert(
    packed.files.some((file) => file.path === path && file.size > 0),
    `Package is missing ${path}`,
  );
}
console.log(
  `Validated ${packed.filename}: README, license, runtime, types and CSS are included.`,
);
