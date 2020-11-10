export interface ParserContext {
  source: string
  readonly originalSource: string
  line: number
  column: number
  offset: number
  options: any
}

// TODO add parser options
export function createParserContext(
  content: string,
  options = {}
): ParserContext {
  return {
    source: content,
    originalSource: content,
    line: 1,
    column: 1,
    offset: 0,
    options,
  }
}
