// Redaction happens at the two sinks that reach a person, the logger and the
// CLI error renderer, rather than at call sites, so a secret that leaks into
// a command line, an HTTP error body or a stack trace is still never printed.

import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Predicate from "effect/Predicate"
import * as Redacted from "effect/Redacted"

export const REDACTED = "[redacted]"

// Redacting "1" or "yes" everywhere would garble output without protecting
// anything.
const MIN_SECRET_LENGTH = 6

export interface SecretStore {
  readonly add: (value: string) => void
  readonly redact: (text: string) => string
  readonly size: () => number
}

export const makeSecretStore = (): SecretStore => {
  const values = new Set<string>()
  let ordered: ReadonlyArray<string> = []
  return {
    add: (value) => {
      const trimmed = value.trim()
      if (trimmed.length < MIN_SECRET_LENGTH || values.has(trimmed)) {
        return
      }
      values.add(trimmed)
      // Longest first, so a secret containing another is replaced whole.
      ordered = [...values].sort((a, b) => b.length - a.length)
    },
    redact: (text) =>
      ordered.reduce(
        (output, value) => output.split(value).join(REDACTED),
        text
      ),
    size: () => values.size,
  }
}

export const Secrets = Context.Reference<SecretStore>(
  "onedocs/scripts/Secrets",
  {
    defaultValue: makeSecretStore,
  }
)

export const registerSecret = (value: string | Redacted.Redacted<string>) =>
  Effect.map(Secrets, (store) =>
    store.add(Redacted.isRedacted(value) ? Redacted.value(value) : value)
  )

// Walks a decoded value, so a config schema marks its secrets by type alone.
export const registerRedacted = (value: unknown) =>
  Effect.map(Secrets, (store) => {
    const visit = (node: unknown): void => {
      if (Redacted.isRedacted(node)) {
        const inner: unknown = Redacted.value(node)
        if (Predicate.isString(inner)) {
          store.add(inner)
        }
        return
      }
      if (Array.isArray(node)) {
        node.forEach(visit)
      } else if (Predicate.isObject(node)) {
        Object.values(node).forEach(visit)
      }
    }
    visit(value)
  })

export const redact = (text: string) =>
  Effect.map(Secrets, (store) => store.redact(text))
