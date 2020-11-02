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

export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export interface CommentNode extends Node {
  type: NodeTypes.COMMENT;
  content: string;
}
