import { advanceBy, emitError, getCursor, getSourceLocation } from '../utils';
import { NodeTypes, CommentNode } from '../ast';
import { ParserContext } from './parser';
import { ErrorCodes } from '../helpers/errors';

export function parseComment(context): CommentNode {
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
    emitError("Compiler error", ErrorCodes.COMMENT_NOT_CLOSED, getCursor(context))
  }

  return {
    type: NodeTypes.COMMENT,
    content,
    loc: getSourceLocation(context, start),
  };
}

function checkCommentContent(match: RegExpExecArray) {
  if (match.index < 4) {
    // TODO 抛出错误 无内容注释
  }
}

function checkNestedComment(context: ParserContext, match: RegExpExecArray) {
  const s = context.source.slice(0, match.index);
  let firstCommentHeadIndex = 1;
  let secondCommentHeadIndex = 0;

  secondCommentHeadIndex = s.indexOf('<!--', firstCommentHeadIndex);
  while (secondCommentHeadIndex !== -1) {
    // 存在嵌套
    advanceBy(context, secondCommentHeadIndex - firstCommentHeadIndex + 1);
    if (secondCommentHeadIndex + 4 < s.length) {
      // TODO 抛出错误
    }
    // 匹配第二个 <!--
    firstCommentHeadIndex = secondCommentHeadIndex + 1;
    secondCommentHeadIndex = s.indexOf('<!--', firstCommentHeadIndex);
  }

  return firstCommentHeadIndex - 1;
}