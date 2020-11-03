import { isArray } from './../utils';
import { TemplateBaseNode } from './../ast';
import { emitError, getCursor, pushNode, startsWith } from '../utils';
import { parseComment } from './parseComment';
import { parseText } from './parseText';
import { ErrorCodes } from '../helpers/errors';

type Token = TemplateBaseNode | TemplateBaseNode[] | undefined

export interface ParserContext {
  source: string;
  readonly originalSource: string;
  line: number;
  column: number;
  offset: number;
  options: any;
}

export function parser(content: string, options = {}) {
  // TODO tokenizer
  tokenizer(content, options);
  // TODO generate AST
}

export function tokenizer(content: string, options = {}) {
  const context = createTokenizerContext(content, options);
  return parseChildren(context);
}

function createTokenizerContext(content: string, options = {}): ParserContext {
  return {
    source: content,
    originalSource: content,
    line: 1,
    column: 1,
    offset: 0,
    options,
  };
}

function parseChildren(context) {
  const tokens: TemplateBaseNode[] = []

  while (context.source) {
    const stream = context.source
    let token: Token = undefined

    if (isTagOpen(stream)) {

      if (maybeComment(stream)) {

        if (isNormalComment(stream)) {
          token = parseComment(context)
        } else if (isBogusComment(stream)) {
          // TODO parse bogus comment
        } else if (isCDATA(stream)) {
          // TODO parse CDATA
        }

      } else if (isTagClosed(stream)) {
        // TODO parse closed tag
      } else if (isElement(stream)) {
        // TODO parse element
      } else {
        emitError("Compiler error", ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME, getCursor(context))
      }
    } else if (isInterpolation(stream)) {

    }

    if (!token) {
      token = parseText(context)
    }

    saveCurrentToken(token, tokens)
  }

  return tokens
}

function isTagOpen(stream: string): boolean {
  return stream.startsWith("<")
}

function isInterpolation(stream: string): boolean {
  return stream.startsWith("{{")
}

function maybeComment(stream: string): boolean {
  return stream[1] === "!"
}

function isNormalComment(stream: string): boolean {
  return stream.startsWith("<!--")
}

function isBogusComment(stream: string): boolean {
  return stream.startsWith("<!DOCTYPE")
}

function isCDATA(stream: string): boolean {
  return stream.startsWith("![CDATA[")
}

function isTagClosed(stream: string): boolean {
  return stream[1] === "/"
}

function isElement(stream: string): boolean {
  return /[a-z]/i.test(stream[1])
}

function saveCurrentToken(token: Token, tokens: TemplateBaseNode[]) {
  if (isArray(token)) {
    token.forEach(t => {
      pushNode(t, tokens)
    })
  } else {
    pushNode(token, tokens)
  }
}