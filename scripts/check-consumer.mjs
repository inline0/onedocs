import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directory = await mkdtemp(join(tmpdir(), "onedocs-consumer-"));
try {
  const [packed] = JSON.parse(
    execFileSync("npm", ["pack", "--json", "--pack-destination", directory], {
      cwd: new URL("../packages/onedocs", import.meta.url),
      encoding: "utf8",
    }),
  );
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({
      name: "onedocs-consumer-check",
      private: true,
      type: "module",
    }),
  );
  // Install the tarball and resolve peers as a consumer does, including current
  // lucide-react. Do not bypass npm's peer or engine checks.
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      join(directory, packed.filename),
      "lucide-react@latest",
      "typescript@^5.9",
      "@types/react@^19.2",
    ],
    {
      cwd: directory,
      stdio: "inherit",
    },
  );
  const types = await readFile(
    new URL("../packages/onedocs/tests/source-types.ts", import.meta.url),
    "utf8",
  );
  await writeFile(
    join(directory, "source-types.ts"),
    types
      .replaceAll('"../src/source"', '"onedocs/source"')
      .replaceAll('"../src/llms"', '"onedocs/llms"'),
  );
  await writeFile(
    join(directory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["source-types.ts"],
    }),
  );
  execFileSync(
    process.execPath,
    [
      join(directory, "node_modules/typescript/bin/tsc"),
      "-p",
      join(directory, "tsconfig.json"),
    ],
    { stdio: "inherit" },
  );
  console.log(
    "Consumer install and published source types passed with current compatible peers.",
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
