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
    const source = context.source;
    let node;

    if (startsWith(source, "<")) {
        if (source[1] === '!') {
          // 解析注释节点
          if (startsWith(source, '<!--')) {
            node = parseComment(context);
          }
          // TODO DOCTYPE CDATA
        } else if (source[1] === '/') {

          // 结束标签
        } else if (/[a-z]/i.test(source[1])) {
          // TODO parse element
        } else {
          // TODO emit error
        }
    } else if (startsWith(source, "{{")) {
        // TODO parse interpolation
    }

    if (!node) {
      node = parseText(context);
    }

    pushNode(node, nodes);
  }

  return nodes
}
