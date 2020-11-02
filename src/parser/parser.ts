import { advanceBy, getCursor, getSourceLocation, pushNode, startsWith } from '../utils';
import { NodeTypes, SourceLocation } from '../ast';
import { parseComment } from './parseComment';
import { parseText } from './parseText';

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
  const nodes = [];

  while (!!context.source) {
    const s = context.source;
    let node;

    // TODO 类型化 options
    if (startsWith(s, '{{')) {
      // TODO parse interpolation
    } else if (s[0] === '<') {
      if (s[1] === '!') {
        // 解析注释节点
        if (startsWith(s, '<!--')) {
          // TODO parse comment
          node = parseComment(context);
        }

        // TODO DOCTYPE CDATA
      } else if (s[1] === '/') {
        // 结束标签
      } else if (/[a-z]/i.test(s[1])) {
        // TODO parse element
      } else {
        // TODO emit error
      }
    }

    if (!node) {
      node = parseText(context);
    }

    pushNode(node, nodes);
  }
}
