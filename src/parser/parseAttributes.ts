import { AttributeNode, NodeTypes, SourceLocation, TagType } from '../ast'
import { ErrorCodes } from '../helpers/errors'
import {
  advanceBy,
  advanceSpaces,
  emitError,
  getCursor,
  getSourceLocation,
} from '../utils'
import { ParserContext } from './parser'

interface AttributeValue {
  content: string
  isQuoted: boolean
  loc: SourceLocation
}

export function parseAttributes(
  context: ParserContext,
  type: TagType
): AttributeNode[] {
  const props = []
  const attributeNames = new Set<string>()

  while (isAttribuesEnd(context)) {
    if (context.source.startsWith('/')) {
      // 突然就结束了的 tag
      advanceBy(context, 1)
      advanceSpaces(context)
      continue
    }

    if (type === TagType.End) {
      // 写在结束 tag 里的 属性
      emitError(
        'Compiler error',
        ErrorCodes.END_TAG_WITH_ATTRIBUTES,
        getCursor(context)
      )
    }

    const attribute = parseAttribute(context, attributeNames)

    if (type === TagType.Start) {
      props.push(attribute)
    }

    checkWhitespaceBetweenAttrs(context)
    advanceSpaces(context)
  }

  return props
}

function parseAttribute(
  context: ParserContext,
  attributeNames: Set<string>
): AttributeNode {
  const name = parseAttributeName(context, attributeNames)

  // Parse value
  const start = getCursor(context)
  let value: AttributeValue | undefined

  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceSpaces(context)
    // TODO 将所有 advanceBy 的前进步数改的更加清晰
    advanceBy(context, '='.length)
    advanceSpaces(context)
    value = parseAttributeValue(context)
    if (!value) {
      emitError(
        'Compiler error',
        ErrorCodes.MISSING_ATTRIBUTE_VALUE,
        getCursor(context)
      )
    }
  }
  const loc = getSourceLocation(context, start)

  if (isAttributeSugar(name)) {
    // TODO 语法脱糖
    const match = /(?:^v-([a-z0-9-]+))?$/i.exec(name)!
    const desugar = match[1]
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc,
    },
    loc,
  }
}

function parseAttributeName(
  context: ParserContext,
  attributeNames: Set<string>
): string {
  const match = fetchAttributeName(context)
  const name = match[0]

  checkAttributeName(context, name, attributeNames)

  attributeNames.add(name)
  advanceBy(context, name.length)

  return name
}

function parseAttributeValue(context: ParserContext): AttributeValue {
  return {} as AttributeValue
}

function isAttribuesEnd(context: ParserContext): boolean {
  return (
    context.source.length > 0 &&
    !context.source.startsWith('>') &&
    !context.source.startsWith('/>')
  )
}

function checkWhitespaceBetweenAttrs(context: ParserContext) {
  if (/^[^\t\r\n\f />]/.test(context.source)) {
    emitError(
      'Compiler error',
      ErrorCodes.MISSING_WHITESPACE_BETWEEN_ATTRIBUTES,
      getCursor(context)
    )
  }
}

function fetchAttributeName(context: ParserContext) {
  return /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!
}

function checkAttributeName(
  context: ParserContext,
  name: string,
  attributeNames: Set<string>
) {
  if (attributeNames.has(name)) {
    emitError(
      'Compiler error',
      ErrorCodes.DUPLICATE_ATTRIBUTE,
      getCursor(context)
    )
  }

  if (/["'<]/g.exec(name)) {
    emitError(
      'Compiler error',
      ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME,
      getCursor(context)
    )
  }

  if (name[0] === '=') {
    emitError(
      'Compiler error',
      ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME,
      getCursor(context)
    )
  }
}

function isAttributeSugar(name: string): boolean {
  return /^(v-|:|@|#)/.test(name)
}
