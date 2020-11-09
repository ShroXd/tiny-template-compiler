import { InterpolationNode, NodeTypes } from '../ast'
import { ErrorCodes } from '../helpers/errors'
import { advanceBy, emitError, getCursor, getSourceLocation } from '../utils'
import { ParserContext } from './parser'

export function parseInterpolation(context: ParserContext): InterpolationNode {
  const left = '{{'
  const right = '}}'

  const endIndex = context.source.indexOf(right, left.length)
  if (endIndex === -1) {
    emitError(
      'Compiler error',
      ErrorCodes.X_MISSING_INTERPOLATION_END,
      getCursor(context)
    )
    return undefined
  }

  const sourceStart = getCursor(context)
  const rawContent = context.source.slice(left.length, endIndex)
  advanceBy(context, left.length)
  const innerStart = getCursor(context)
  const content = rawContent.trim()
  advanceBy(context, rawContent.length)
  const innerEnd = getCursor(context)
  advanceBy(context, right.length)
  const sourceEnd = getCursor(context)

  // TODO: 处理 expression 的冗余空格换行等
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
      loc: getSourceLocation(context, innerStart, innerEnd),
    },
    loc: getSourceLocation(context, sourceStart, sourceEnd),
  }
}
