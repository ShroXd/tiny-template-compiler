import { advanceBy, getCursor, startsWith } from './utils';
import { NodeTypes, SourceLocation } from './ast';

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

function tokenizer(content: string, options = {}) {
  const context = createTokenizerContext(content, options);
  return parseChildren(context);
}

function createTokenizerContext(content: string, options = {}) {
  return {
    source: content,
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
    let node = undefined;

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

    console.log(node);
  }
}

function parseComment(context) {
  const start = getCursor(context);
  const { source } = context;
  let content: string;

  const match = /-->/.exec(source);

  if (match) {
    checkCommentContent(match);
    content = source.slice(4, match.index);
    const firstCommentHeadIndex = checkNestedComment(context, match);
    advanceBy(context, match.index + match[0].length - firstCommentHeadIndex);
  } else {
    content = source.slice(4);
    advanceBy(context, context.source.length);
    // TODO 抛出错误
  }

  return {
    type: NodeTypes.COMMENT,
    content,
    loc: getSourceLocation(context, start),
  };
}

function parseText(context) {
  
}

function checkCommentContent(match: RegExpExecArray) {
  if (match.index < 4) {
    // TODO 抛出错误 无内容注释
  }
}

function checkNestedComment(context: ParserContext, match: RegExpExecArray) {
  const s = context.source.slice(0, match.index);
  let firstCommentHeadIndex = 1,
    secondCommentHeadIndex = 0;

  while ((secondCommentHeadIndex = s.indexOf('<!--', firstCommentHeadIndex)) !== -1) {
    // 存在嵌套
    advanceBy(context, secondCommentHeadIndex - firstCommentHeadIndex + 1);
    if (secondCommentHeadIndex + 4 < s.length) {
      // TODO 抛出错误
    }
    // 匹配第二个 <!--
    firstCommentHeadIndex = secondCommentHeadIndex + 1;
  }

  return firstCommentHeadIndex - 1;
}

function getSourceLocation(context, start, end?): SourceLocation {
  return {
    start,
    end: end || getCursor(context),
  };
}
