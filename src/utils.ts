import { ParserContext } from './parser/parser';
import { NodeTypes, SourceLocation } from './ast';

export interface CompilerError extends SyntaxError {
  code: number;
  loc?: any;
}

export function startsWith(source: string, matching: string): boolean {
  return source.startsWith(matching);
}

export function emitError(context, code, offset, location = getCursor(context)) {
  if (offset) {
    location.offset += offset;
    location.column += offset;
  }

  const error = new SyntaxError('Compiler error') as CompilerError;
  error.code = code;
  error.loc = location;

  return error as any;
}

export function advanceBy(context, numberOfCharacters: number): void {
  const { source } = context;
  advancePosition(context, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

export function getCursor(context) {
  const { line, column, offset } = context;
  return { line, column, offset };
}

export function pushNode(node, nodes) {
  // merge text node
  if (node.type === NodeTypes.TEXT) {
    const prev = nodes[nodes.length - 1]

    if (prev && prev.type === NodeTypes.TEXT && prev.loc.end.offset === node.loc.start.offset) {
      prev.content += node.content
      prev.loc.end = node.loc.end
      // TODO: 是否需要 source
    }
  }

  nodes.push(node)
}

export function getSourceLocation(context, start, end?): SourceLocation {
  return {
    start,
    end: end || getCursor(context),
  };
}

function advancePosition(context: ParserContext, numberOfCharacters = context.source.length) {
  const { source } = context;
  let newLinesCount = 0;
  const lastLineColumn = -1;

  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      newLinesCount++;
    }
  }

  context.line += newLinesCount;
  context.offset += numberOfCharacters;
  context.column = lastLineColumn === -1 ? context.column + numberOfCharacters : numberOfCharacters - lastLineColumn;

  return context;
}
