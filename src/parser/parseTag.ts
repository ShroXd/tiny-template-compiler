import {
  advanceBy,
  advanceSpaces,
  getCursor,
  getSourceLocation,
} from '../utils'
import { ElementNode, ElementTypes, NodeTypes, TagType } from './../ast'
import { parseAttributes } from './parseAttributes'
import { ParserContext } from './parserContext'
import { getNamespace } from './parserOptions'

export function parseTag(
  context: ParserContext,
  type: TagType,
  parent: ElementNode | undefined
): ElementNode {
  // Tag open
  const start = getCursor(context)
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!
  const tag = match[1]
  const namespace = getNamespace(tag, parent)

  advanceBy(context, match[0].length)
  advanceSpaces(context)

  // Handle attributes
  const props = context.source[0] === '>' ? [] : parseAttributes(context, type)

  // Close start tag
  let isSelfClosing = false
  if (context.source.length !== 0) {
    isSelfClosing = context.source.startsWith('/>')
    advanceBy(context, isSelfClosing ? 2 : 1)
  }

  let tagType = ElementTypes.TEMPLATE
  if (/^[A-Z]/.test(tag) || tag === 'component') {
    tagType = ElementTypes.COMPONENT
  }

  if (tag === 'slot') {
    tagType = ElementTypes.SLOT
  }

  return {
    type: NodeTypes.ELEMENT,
    namespace,
    tag,
    tagType,
    props,
    isSelfClosing,
    children: [],
    loc: getSourceLocation(context, start),
  }
}
