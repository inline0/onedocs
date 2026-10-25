import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { run as consumer } from "./check-consumer.ts"
import * as Command from "./lib/command.ts"
import { rewrite } from "./prepare-declarations.ts"

const invoke = (script: string, args: string[]) =>
  spawnSync(
    process.execPath,
    [fileURLToPath(new URL(`./${script}.ts`, import.meta.url)), ...args],
    { encoding: "utf8", timeout: 10_000 }
  )

test("every tooling entry supports help without running its body", () => {
  for (const name of [
    "check-docs-content",
    "check-workspace",
    "check-consumer",
    "check-package",
    "prepare-package",
    "prepare-declarations",
  ]) {
    const result = invoke(name, ["--help"])
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /--dry-run/)
    assert.match(result.stdout, /--json/)
  }
  assert.equal(invoke("prepare-package", ["--unknown"]).status, 2)
})

test("consumer dry-run emits one JSON result and invokes no installation", () => {
  const result = invoke("check-consumer", ["--dry-run", "--json"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(
    (JSON.parse(result.stdout) as { planned: string }).planned,
    /temporary consumer/
  )
})

test("declaration preparation preserves JS imports and supports a nonwriting preview", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "onedocs-declarations-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const source =
    'export { A } from "./a.ts";type B=import("./b.tsx");export { C } from "./c.js";'
  assert.equal(
    rewrite(source),
    'export { A } from "./a.js";type B=import("./b.js");export { C } from "./c.js";'
  )
  const path = join(directory, "index.d.ts")
  await writeFile(path, source)
  const preview = invoke("prepare-declarations", [
    "--directory",
    directory,
    "--dry-run",
    "--json",
  ])
  assert.equal(preview.status, 0, preview.stderr)
  assert.equal((JSON.parse(preview.stdout) as { changed: number }).changed, 1)
  assert.equal(await readFile(path, "utf8"), source)
  const prepared = invoke("prepare-declarations", [
    "--directory",
    directory,
    "--json",
  ])
  assert.equal(prepared.status, 0, prepared.stderr)
  assert.equal(await readFile(path, "utf8"), rewrite(source))
})

test("a consumer command failure closes its temporary installation scope", async () => {
  let temporary = ""
  const fake = Layer.succeed(Command.Command, {
    run: (call) => {
      if (call.command === "pnpm") {
        const index = call.args?.indexOf("--pack-destination") ?? -1
        temporary = call.args?.[index + 1] ?? ""
        return Effect.succeed({
          exitCode: 0,
          stdout: '{"filename":"fixture.tgz"}',
          stderr: "",
          stdoutBytes: new Uint8Array(),
        })
      }
      return Effect.fail(
        new Command.CommandFailed({
          command: call.command,
          exitCode: 9,
          stderr: "fixture failure",
          message: "fixture failure",
        })
      )
    },
  })
  const failure = await Effect.runPromise(
    consumer(
      fileURLToPath(new URL("../", import.meta.url)),
      process.execPath
    ).pipe(Effect.flip, Effect.provide(Layer.merge(NodeServices.layer, fake)))
  )
  assert(failure instanceof Command.CommandFailed)
  assert(temporary.includes("onedocs-consumer-"))
  await assert.rejects(readFile(join(temporary, "package.json")), {
    code: "ENOENT",
  })
})
