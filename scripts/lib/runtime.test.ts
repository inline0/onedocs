import assert from "node:assert/strict"
import { test } from "node:test"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Command from "./command.ts"
import { runtimeLayer } from "./runtime.ts"

test("commands drain both pipes, preserve environment and report failures", async () => {
  const result = await Effect.runPromise(
    Command.run({
      command: process.execPath,
      args: [
        "-e",
        "process.stdout.write(process.env.ONE);process.stderr.write('x'.repeat(131072))",
      ],
      env: { ONE: "kept" },
      mutates: false,
    }).pipe(Effect.provide(runtimeLayer({ dryRun: false, logFormat: "text" })))
  )
  assert.equal(result.stdout, "kept")
  assert.equal(result.stderr.length, 131072)
  const failure = await Effect.runPromise(
    Command.run({
      command: process.execPath,
      args: ["-e", "process.exit(7)"],
      mutates: false,
    }).pipe(
      Effect.flip,
      Effect.provide(runtimeLayer({ dryRun: false, logFormat: "text" }))
    )
  )
  assert(failure instanceof Command.CommandFailed)
  assert.equal(failure.exitCode, 7)
})

test("dry-run suppresses mutations while allowing read-only calls", async () => {
  const result = await Effect.runPromise(
    Effect.all([
      Command.run({ command: "an-executable-that-does-not-exist" }),
      Command.text({
        command: process.execPath,
        args: ["-e", "console.log('read')"],
        mutates: false,
      }),
    ]).pipe(Effect.provide(runtimeLayer({ dryRun: true, logFormat: "json" })))
  )
  assert.equal(result[0].exitCode, 0)
  assert.equal(result[1], "read\n")
})

test(
  "interruption reaps a child that ignores SIGTERM",
  { timeout: 10_000 },
  async (t) => {
    let announce: (pid: number) => void = () => {}
    const ready = new Promise<number>((resolve) => {
      announce = resolve
    })
    const controller = new AbortController()
    let pid: number | undefined
    t.after(() => {
      controller.abort()
      if (pid !== undefined) {
        try {
          process.kill(pid, "SIGKILL")
        } catch {
          /* The scope already reaped it. */
        }
      }
    })
    const task = Effect.runPromiseExit(
      Command.run({
        command: process.execPath,
        args: [
          "-e",
          "process.on('SIGTERM',()=>{});console.log(process.pid);setInterval(()=>{},1000)",
        ],
        mutates: false,
        killAfter: "50 millis",
        onLine: (line) => Effect.sync(() => announce(Number(line))),
      }).pipe(
        Effect.provide(runtimeLayer({ dryRun: false, logFormat: "text" }))
      ),
      { signal: controller.signal }
    )
    const childPid = await ready
    pid = childPid
    controller.abort()
    assert(Exit.isFailure(await task))
    assert.throws(() => process.kill(childPid, 0), { code: "ESRCH" })
  }
)
