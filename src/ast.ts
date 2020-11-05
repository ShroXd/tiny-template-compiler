export const enum ElementTypes {
  ELEMENT,
  COMPONENT,
  SLOT,
  TEMPLATE,
}

export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  ATTRIBUTE,
}

/**
 * Element Type
 */
export interface BaseElementNode extends Node {
  type: NodeTypes.ELEMENT
  namespace: number
  tag: string
  isSelfClosing: boolean
  props: AttributeNode[]
  children: TemplateBaseNode[]
}

export interface ComponentNode extends BaseElementNode {
  tagType: ElementTypes.COMPONENT
  codegenNode: undefined
}

export interface SlotNode extends BaseElementNode {
  tagType: ElementTypes.SLOT
  codegenNode: undefined
}

export interface TemplateNode extends BaseElementNode {
  tagType: ElementTypes.TEMPLATE
  codegenNode: undefined
}

export type ElementNode = ComponentNode | SlotNode | TemplateNode

/**
 * Node Type
 */
export interface Node {
  type: NodeTypes
  loc: SourceLocation
}

export interface CommentNode extends Node {
  type: NodeTypes.COMMENT
  content: string
}

export interface TextNode extends Node {
  type: NodeTypes.TEXT
  content: string
}

export interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE
  name: string
  value: TextNode | undefined
}

export type TemplateBaseNode = CommentNode | TextNode | ElementNode

/*
 * Pattern
 */
export enum Pattern {
  COMMENT = '<!--',
}

/*
 * Helpers
 * */
export interface Position {
  line: number
  column: number
  offset: number
}

export interface SourceLocation {
  start: Position
  end: Position
}

export const enum TagType {
  Start,
  End,
}
