import { ParserContext } from './parser';

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

function advancePosition(context: ParserContext, numberOfCharacters = context.source.length) {
  const { source } = context;
  let newLinesCount = 0;
  let lastLineColumn = -1;

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
