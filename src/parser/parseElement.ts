import { parseChildren, ParserContext } from './parser'
import { ElementNode, TagType } from '../ast'
import { parseTag } from './parseTag'
import { getSourceLocation } from '../utils'

export function parseElement(
  context: ParserContext,
  ancestors: ElementNode[]
): ElementNode {
  // Start tag
  const parent = ancestors[ancestors.length - 1]
  const element = parseTag(context, TagType.Start, parent)

  if (element.isSelfClosing) {
    return element
  }

  // Handle children
  ancestors.push(element)
  const children = parseChildren(context, ancestors)
  ancestors.pop()

  element.children = children

  // End tag
  if (checkEndTag(context.source, element.tag)) {
    parseTag(context, TagType.End, parent)
  }

  element.loc = getSourceLocation(context, element.loc.start)

  return element
}

function checkEndTag(source: string, tag: string): boolean {
  return (
    source.startsWith('</') &&
    source.substr(2, tag.length).toLocaleLowerCase() ===
      tag.toLocaleLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
  )
}
