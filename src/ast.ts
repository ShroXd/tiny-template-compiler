/**
 * Node Type
 */
export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
}

export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export interface CommentNode extends Node {
  type: NodeTypes.COMMENT;
  content: string;
}

export interface TextNode extends Node {
  type: NodeTypes.TEXT;
  content: string;
}

export interface ElementNode extends Node {
  type: NodeTypes.ELEMENT;
  content: string;
  tag: string;
}

export type TemplateBaseNode = CommentNode | TextNode | ElementNode;

/*
 * Pattern
 */
export enum Pattern {
  COMMENT = "<!--",
}

/*
 * Helpers
 * */
export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
}
