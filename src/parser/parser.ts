import { NodeTypes, TemplateBaseNode, ElementNode } from './../ast'
import { emitError, getCursor, pushNode, advanceBy, isArray } from '../utils'
import { parseComment } from './parseComment'
import { parseText } from './parseText'
import { ErrorCodes } from '../helpers/errors'
import { parseElement } from './parseElement'

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
  let tokens: TemplateBaseNode[] = []

  while (context.source) {
    const stream = context.source
    let token: Token

    if (isTagOpen(stream)) {
      if (isComment(stream)) {
        if (isNormalComment(stream)) {
          token = parseComment(context)
        } else if (isBogusComment(stream)) {
          // TODO parse bogus comment
        } else if (isCDATA(stream)) {
          // TODO parse CDATA
        }
      } else if (isTagClosed(stream)) {
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
          advanceBy(context, 3)
          continue
        } else if (/[a-z]/i.test(stream[2])) {
          // TODO pargeTag()
          continue
        } else {
          emitError(
            'Compiler error',
            ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
            getCursor(context)
          )
          // TODO parseBogusComment()
        }
      } else if (isElement(stream)) {
        token = parseElement(context, ancestors)
      } else if (stream[1] === '?') {
        emitError(
          'Compiler error',
          ErrorCodes.UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME,
          getCursor(context)
        )
        // TODO parseBogunComment()
      } else {
        emitError(
          'Compiler error',
          ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
          getCursor(context)
        )
      }
    } else if (isInterpolation(stream)) {
      // TODO parse interpolation
    }

    if (!token) {
      token = parseText(context)
    }

    saveCurrentToken(token, tokens)
  }

  tokens = handleWhiteSpace(tokens)

  return tokens
}

function handleWhiteSpace(tokens: TemplateBaseNode[]) {
  let needFilterWhitespace = false

  tokens.forEach((val, index, arr) => {
    if (val.type === NodeTypes.TEXT) {
      if (hasRedundantCharacters(val.content)) {
        val.content = val.content.replace(/[\t\r\n\f ]+/g, ' ')
      }

      const prev = arr[index - 1]
      const next = arr[index + 1]

      if (isNeedIgnoreWhitespace(prev, next, val.content)) {
        needFilterWhitespace = true
        arr[index] = null as any
      } else {
        val.content = ' '
      }
    }

    // TODO Maybe remove comment in production
  })

  return needFilterWhitespace ? tokens.filter(Boolean) : tokens
}

function isTagOpen(stream: string): boolean {
  return stream.startsWith('<')
}

function isInterpolation(stream: string): boolean {
  return stream.startsWith('{{')
}

function isComment(stream: string): boolean {
  return stream[1] === '!'
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

function isTagClosed(stream: string): boolean {
  return stream[1] === '/'
}

function isElement(stream: string): boolean {
  return /[a-z]/i.test(stream[1])
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

function hasRedundantCharacters(content: string) {
  return /[^\t\r\n\f]/.test(content)
}

function isNeedIgnoreWhitespace(
  prev: TemplateBaseNode,
  next: TemplateBaseNode,
  content: string
) {
  return (
    !prev ||
    !next ||
    isAdjacentToComment(prev, next) ||
    isContainsNewlineAndBetweenElements(prev, next, content)
  )
}

function isAdjacentToComment(prev: TemplateBaseNode, next: TemplateBaseNode) {
  return prev.type === NodeTypes.COMMENT || next.type === NodeTypes.COMMENT
}

function isContainsNewlineAndBetweenElements(
  prev: TemplateBaseNode,
  next: TemplateBaseNode,
  content: string
) {
  return (
    prev.type === NodeTypes.ELEMENT &&
    next.type === NodeTypes.ELEMENT &&
    /[\r\n]/.test(content)
  )
}
