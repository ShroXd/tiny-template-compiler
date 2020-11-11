import { RootNode, TemplateBaseNode } from '../ast'
import { transformContext } from './transformContext'
import { transformElement } from './transformElement'
import { transformExpression } from './transformExpression'
import { transformText } from './transformText'

export interface TransformOptions {
  nodeTransforms?: NodeTransform[]
}

// 一些节点转换函数返回一个或一组退出函数
export type NodeTransform = (
  node: RootNode | TemplateBaseNode,
  context: transformContext
) => void | (() => void) | (() => void)[]

// TODO 指令转换
export type TransformPreset = [NodeTransform[]]

export function getTransformPreset(): TransformPreset {
  return [[transformElement, transformExpression, transformText]]
}
