import {
  NodeTypes,
  TemplateChildNode,
  ElementNode,
  TagType,
  SourceLocation,
  RootNode,
} from './../ast'
import {
  emitError,
  getCursor,
  pushNode,
  isArray,
  getSourceLocation,
} from '../utils'
import { parseComment } from './parseComment'
import { parseText } from './parseText'
import { ErrorCodes } from '../helpers/errors'
import { parseElement } from './parseElement'
import { parseTag } from './parseTag'
import { parseInterpolation } from './parseInterpolation'
import { createParserContext, ParserContext } from './parserContext'

type Token = TemplateChildNode | TemplateChildNode[] | undefined

export const enum TextModes {}

export function parser(content: string, options = {}) {
  const context = createParserContext(content, options)
  const start = getCursor(context)
  return createRoot(
    parseChildren(context, []),
    getSourceLocation(context, start)
  )
}

export function parseChildren(
  context: ParserContext,
  ancestors: ElementNode[]
) {
  const parent = ancestors[ancestors.length - 1]
  const tokens: TemplateChildNode[] = []

  const handleComment = (stream: string): Token => {
    let token: Token

    if (isNormalComment(stream)) {
      token = parseComment(context)
    } else if (isBogusComment(stream)) {
      // TODO parse bogus stream
    } else if (isCDATA(stream)) {
      // TODO parse cdata stream
    } else {
      emitError(
        'Compiler error',
        ErrorCodes.INCORRECTLY_CLOSED_COMMENT,
        getCursor(context)
      )
    }

    return token
  }

  while (isTemplateEnd(context, ancestors)) {
    const stream = context.source
    let token: Token

    if (isTagOpen(stream)) {
      if (stream[1] === '!') {
        token = handleComment(stream)
      } else if (stream[1] === '/') {
        if (stream.length === 2 /* </ */) {
          emitError(
            'Compiler error',
            ErrorCodes.EOF_BEFORE_TAG_NAME,
            getCursor(context)
          )
        } else if (stream[2] === '>' /* </> */) {
          emitError(
            'Compiler error',
            ErrorCodes.MISSING_END_TAG_NAME,
            getCursor(context)
          )
        } else if (/[a-z]/i.test(stream[2])) {
          parseTag(context, TagType.End, parent)
          continue
        } else {
          emitError(
            'Compiler error',
            ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
            getCursor(context)
          )
          // TODO parseBogusComment()
        }
      } else if (/[a-z]/i.test(stream[1])) {
        token = parseElement(context, ancestors)
      } else {
        emitError(
          'Compiler error',
          ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
          getCursor(context)
        )
      }
    } else if (isInterpolation(stream)) {
      token = parseInterpolation(context)
    }

    if (!token) {
      token = parseText(context)
    }

    saveCurrentToken(token, tokens)
  }

  let needFilterWhitespace = false

  tokens.forEach((val, index, arr) => {
    // parse text will cut out redundant characters
    // TODO 此处可能会导致注释节点前后的空节点无法被排除
    // TODO 对 comment 节点直接跳过
    if (
      val.type === NodeTypes.COMMENT ||
      val.type !== NodeTypes.TEXT ||
      /[^\t\r\n\f ]/.test(val.content)
    ) {
      return
    }
    const prev = arr[index - 1]
    const next = arr[index + 1]

    if (
      !prev ||
      !next ||
      prev.type === NodeTypes.COMMENT ||
      next.type === NodeTypes.COMMENT ||
      (prev.type === NodeTypes.ELEMENT &&
        next.type === NodeTypes.ELEMENT &&
        /[\r\n]/.test(val.content))
    ) {
      arr[index] = null
      needFilterWhitespace = true
    }
  })

  return needFilterWhitespace ? tokens.filter(Boolean) : tokens
}

export const locStub: SourceLocation = {
  start: { line: 1, column: 1, offset: 0 },
  end: { line: 1, column: 1, offset: 0 },
}

function createRoot(children: TemplateChildNode[], loc = locStub): RootNode {
  return {
    type: NodeTypes.ROOT,
    children,
    loc,
  }
}

function isTemplateEnd(
  context: ParserContext,
  ancestors: ElementNode[]
): boolean {
  if (
    ancestors.length !== 0 &&
    context.source.startsWith('</') &&
    isEndTagMatching(context.source, ancestors[ancestors.length - 1].tag)
  ) {
    return false
  }

  return !!context.source
}

function isEndTagMatching(source: string, tag: string): boolean {
  return (
    source.startsWith('</') &&
    source.substr(2, tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
  )
}

function isTagOpen(stream: string): boolean {
  return stream.startsWith('<')
}

function isInterpolation(stream: string): boolean {
  return stream.startsWith('{{')
}

function isNormalComment(stream: string): boolean {
  return stream.startsWith('<!--')
}

function isBogusComment(stream: string): boolean {
  return stream.startsWith('<!DOCTYPE')
}

function isCDATA(stream: string): boolean {
  return stream.startsWith('<![CDATA[')
}

function saveCurrentToken(token: Token, tokens: TemplateChildNode[]) {
  if (isArray(token)) {
    token.forEach((t) => {
      pushNode(t, tokens)
    })
  } else {
    pushNode(token, tokens)
  }
}
