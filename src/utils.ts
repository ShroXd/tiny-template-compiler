import { NodeTypes, SourceLocation, TemplateChildNode } from './ast'
import { CompilerError } from './helpers/errors'
import { ParserContext } from './parser/parserContext'

export interface CodeLocation {
  line: number
  column: number
  offset: number
}

// TODO 总结常用的导出方法  例如 object.assign 导出为 extend 来使用

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

export function pushNode(node: TemplateChildNode, nodes: TemplateChildNode[]) {
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

export function getInnerRange(
  loc: SourceLocation,
  offset: number,
  length?: number
): SourceLocation {
  return {} as SourceLocation
}

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isArray = Array.isArray
export const extend = Object.assign

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
