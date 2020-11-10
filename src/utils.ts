import { ParserContext } from './parser/parser'
import { NodeTypes, SourceLocation, TemplateBaseNode } from './ast'
import { CompilerError } from './helpers/errors'

export interface CodeLocation {
  line: number
  column: number
  offset: number
}

export function emitError(msg: string, code: string, location: CodeLocation) {
  // TODO 对截断编译和 warn 的错误区分开
  throw new CompilerError(msg, code, location) as CompilerError
}

export function advanceBy(context, numberOfCharacters: number): void {
  const { source } = context
  advancePosition(context, numberOfCharacters)
  context.source = source.slice(numberOfCharacters)
}

export function advanceSpaces(context: ParserContext): void {
  const match = /^[\t\r\n\f ]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}

export function getCursor(context): CodeLocation {
  const { line, column, offset } = context
  return { line, column, offset }
}

export function pushNode(node: TemplateBaseNode, nodes: TemplateBaseNode[]) {
  if (node.type === NodeTypes.TEXT) {
    // mergeTextNode(prevElement(nodes), node);
  }

  nodes.push(node)
}

export function getSourceLocation(context, start, end?): SourceLocation {
  return {
    start,
    end: end || getCursor(context),
  }
}

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isArray = Array.isArray

function advancePosition(
  context: ParserContext,
  numberOfCharacters = context.source.length
) {
  const { source } = context
  let newLinesCount = 0
  const lastLineColumn = -1

  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      newLinesCount++
    }
  }

  context.line += newLinesCount
  context.offset += numberOfCharacters
  context.column =
    lastLineColumn === -1
      ? context.column + numberOfCharacters
      : numberOfCharacters - lastLineColumn

  return context
}
