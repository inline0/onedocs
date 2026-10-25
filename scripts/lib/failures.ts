export const CLI_EXIT_SUCCESS = 0
export const CLI_EXIT_FAILURE = 1
export const CLI_EXIT_USAGE = 2

export type CliExitCode =
  | typeof CLI_EXIT_SUCCESS
  | typeof CLI_EXIT_FAILURE
  | typeof CLI_EXIT_USAGE

export class CliFailure extends Error {
  readonly code: string
  readonly exitCode: CliExitCode
  readonly hint: string | null

  constructor(
    code: string,
    message: string,
    options: ErrorOptions & {
      readonly exitCode?: CliExitCode
      readonly hint?: string
    } = {}
  ) {
    super(message, options)
    this.name = "CliFailure"
    this.code = code
    this.exitCode = options.exitCode ?? CLI_EXIT_FAILURE
    this.hint = options.hint ?? null
  }
}

export function usageFailure(code: string, message: string, hint?: string) {
  return new CliFailure(code, message, {
    exitCode: CLI_EXIT_USAGE,
    ...(hint === undefined ? {} : { hint }),
  })
}
