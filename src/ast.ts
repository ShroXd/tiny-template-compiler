export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
}

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
}

export function createRoot(

) {

}
