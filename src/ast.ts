import { locStub } from './parser/parser'
import { transformContext } from './transform/transformContext'
import { isString } from './utils'

/**
 * Base Types
 */
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

  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,

  // code generate
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,
}

export interface Node {
  type: NodeTypes
  loc: SourceLocation
  codeGenerateNode?: any
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

/**
 * Union Types
 */
export type ElementNode =
  | PlainElementNode
  | ComponentNode
  | SlotNode
  | TemplateNode

// TODO add if for
export type ParentNode = RootNode | ElementNode

export type TemplateChildNode =
  | CommentNode
  | TextNode
  | ElementNode
  | InterpolationNode

export type TemplateTextChildNode =
  | TextNode
  | InterpolationNode
  | CompoundExpressionNode

export type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode

export type PropsExpression = ObjectExpression | CallExpression | ExpressionNode

export type JSChildNode = VNodeCall | CallExpression

/**
 * Element Type
 */
export interface BaseElementNode extends Node {
  type: NodeTypes.ELEMENT
  namespace: number
  tag: string
  tagType: ElementTypes
  isSelfClosing: boolean
  props: AttributeNode[]
  children: TemplateChildNode[]
}

export interface PlainElementNode extends BaseElementNode {
  tagType: ElementTypes.ELEMENT
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

export interface SimpleExpressionNode extends Node {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
}

/**
 * Node Type
 */
export interface RootNode extends Node {
  type: NodeTypes.ROOT
  children: TemplateChildNode[]
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

export interface SimpleExpressionNode extends Node {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
  isStatic: boolean
  isConstant: boolean
  // TODO hoisted
}

export interface CompoundExpressionNode extends Node {
  type: NodeTypes.COMPOUND_EXPRESSION
  children: (
    | SimpleExpressionNode
    | CompoundExpressionNode
    | InterpolationNode
    | TextNode
    | string
    | symbol
  )[]
}

export interface IfNode extends Node {
  type: NodeTypes.IF
  branches: any[]
  codeGenNode?: any
}

export interface IfBranchNode extends Node {
  type: NodeTypes.IF_BRANCH
  condition: ExpressionNode | undefined
  children: TemplateChildNode[]
}

/**
 * JS Node Types
 */
export interface VNodeCall extends Node {
  type: NodeTypes.VNODE_CALL
  tag: string | symbol
  props: PropsExpression | undefined
  children: TemplateChildNode[] | TemplateTextChildNode
}

export interface CallExpression extends Node {
  type: NodeTypes.JS_CALL_EXPRESSION
  callee: string | symbol
  arguments: (
    | string
    | symbol
    | JSChildNode
    | TemplateChildNode
    | TemplateChildNode[]
  )[]
}

export interface Property extends Node {
  type: NodeTypes.JS_PROPERTY
  key: ExpressionNode
  value: JSChildNode
}

export interface ObjectExpression extends Node {
  type: NodeTypes.JS_OBJECT_EXPRESSION
  properties: Array<Property>
}

export function createCodeGenerateNode(
  context: transformContext | null,
  tag: any,
  props?: any,
  children?: any,
  loc = locStub
) {
  if (context) {
    // TODO create vnode
  }

  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    loc,
  }
}

export function createObjectProperty(
  key: Property['key'],
  value: any
): Property {
  return {
    type: NodeTypes.JS_PROPERTY,
    loc: locStub,
    key: isString(key) ? createSimpleExpression(key, true) : key,
    value,
  }
}

export function createSimpleExpression(
  content: any,
  isStatic: any,
  loc: SourceLocation = locStub,
  isConstant: boolean = false
): SimpleExpressionNode {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    loc,
    isConstant,
    content,
    isStatic,
  }
}
