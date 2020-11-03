import { advanceBy, getCursor, getSourceLocation } from '../utils';
import { NodeTypes, TextNode } from '../ast';

export function parseText(context): TextNode {
  const endTokens = ["<", "{{"]

  let endIndex = context.source.length
  endTokens.forEach(val => {
    const endTokensIndex = context.source.indexOf(val, 1)
    if (endTokensIndex !== -1 && endIndex > endTokensIndex) {
      endIndex = endTokensIndex
    }
  })

  const start = getCursor(context)
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSourceLocation(context, start)
  }
}

function parseTextData(context, length) {
  const raw = context.source.slice(0, length)
  advanceBy(context, length)
  return raw
}