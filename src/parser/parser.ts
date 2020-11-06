import { NodeTypes, TemplateBaseNode, ElementNode, TagType } from './../ast'
import { emitError, getCursor, pushNode, advanceBy, isArray } from '../utils'
import { parseComment } from './parseComment'
import { parseText } from './parseText'
import { ErrorCodes } from '../helpers/errors'
import { parseElement } from './parseElement'
import { parseTag } from './parseTag'
import { parseInterpolation } from './parseInterpolation'

type Token = TemplateBaseNode | TemplateBaseNode[] | undefined

export interface ParserContext {
  source: string
  readonly originalSource: string
  line: number
  column: number
  offset: number
  options: any
}

export function parser(content: string, options = {}) {
  tokenizer(content, options)
  // TODO generate AST
}

export function tokenizer(content: string, options = {}) {
  const context = createTokenizerContext(content, options)
  return parseChildren(context, [])
}

function createTokenizerContext(content: string, options = {}): ParserContext {
  return {
    source: content,
    originalSource: content,
    line: 1,
    column: 1,
    offset: 0,
    options,
  }
}

export function parseChildren(
  context: ParserContext,
  ancestors: ElementNode[]
) {
  const parent = ancestors[ancestors.length - 1]
  let tokens: TemplateBaseNode[] = []

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

  return tokens
}

function isTemplateEnd(
  context: ParserContext,
  ancestors: ElementNode[]
): boolean {
  if (
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
  return stream.startsWith('![CDATA[')
}

function saveCurrentToken(token: Token, tokens: TemplateBaseNode[]) {
  if (isArray(token)) {
    token.forEach((t) => {
      pushNode(t, tokens)
    })
  } else {
    pushNode(token, tokens)
  }
}
