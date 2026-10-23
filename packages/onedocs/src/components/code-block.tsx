import { highlight } from "fumadocs-core/highlight"
import * as Base from "fumadocs-ui/components/codeblock"
import type { HTMLAttributes } from "react"

/**
 * Render highlighted source code using Fumadocs.
 *
 * @param props - Component content and presentation options.
 * @returns The rendered component.
 */
export async function CodeBlock({
  code,
  lang,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  code: string
  lang: string
}) {
  const rendered = await highlight(code, {
    lang,
    components: {
      pre: (props) => <Base.Pre {...props} />,
    },
  })

  return <Base.CodeBlock {...rest}>{rendered}</Base.CodeBlock>
}
