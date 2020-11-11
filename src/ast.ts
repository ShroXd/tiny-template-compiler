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
  INTERPOLATION,
  SIMPLE_EXPRESSION,
}

export interface SimpleExpressionNode extends Node {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
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
}

export interface SlotNode extends BaseElementNode {
  tagType: ElementTypes.SLOT
}

export interface TemplateNode extends BaseElementNode {
  tagType: ElementTypes.TEMPLATE
}

export type ElementNode = ComponentNode | SlotNode | TemplateNode

/**
 * Node Type
 */
export interface Node {
  type: NodeTypes
  loc: SourceLocation
}

export interface RootNode extends Node {
  type: NodeTypes.ROOT
  children: TemplateBaseNode[]
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

export interface InterpolationNode extends Node {
  type: NodeTypes.INTERPOLATION
  content: SimpleExpressionNode
}

export type TemplateBaseNode =
  | CommentNode
  | TextNode
  | ElementNode
  | InterpolationNode

// TODO add if for
export type ParentNode = RootNode | ElementNode

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

// TODO add source code
export interface SourceLocation {
  start: Position
  end: Position
}

export const enum TagType {
  Start,
  End,
}
