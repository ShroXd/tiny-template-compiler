// TODO transform element
// TODO transform expression
// TODO transform text
// TODO transform v-if v-for
// TODO block tree      improve diff
// TODO hoistStatic     improve create node

import { NodeTypes, RootNode, TemplateChildNode, ParentNode } from '../ast'
import { isArray } from '../utils'
import { createTransformContext, transformContext } from './transformContext'
import { TransformOptions } from './transformOptions'

export function transform(root: RootNode, options: TransformOptions = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)

  // for unit test
  return root
}

export function traverseNode(
  node: RootNode | TemplateChildNode,
  context: transformContext
) {
  const { nodeTransforms } = context
  const exitFns = []

  context.currentNode = node

  for (let i = 0; i < nodeTransforms.length; i++) {
    const currentExitFns = nodeTransforms[i](node, context)
    if (currentExitFns) {
      if (isArray(currentExitFns)) {
        exitFns.push(...currentExitFns)
      } else {
        exitFns.push(currentExitFns)
      }
    }
    if (!context.currentNode) {
      return
    } else {
      node = context.currentNode
    }
  }

  switch (node.type) {
    case NodeTypes.COMMENT:
      // TODO 处理注释节点
      break
    case NodeTypes.INTERPOLATION:
      // TODO 处理表达式节点
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break
  }

  // exit transforms
  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

export function traverseChildren(
  parent: ParentNode,
  context: transformContext
) {
  let i = 0
  const removeNode = () => {
    i--
  }
  for (; i < parent.children.length; i++) {
    const child = parent.children[i]

    context.parent = parent
    context.childIndex = i
    context.removeNode = removeNode

    traverseNode(child, context)
  }
}
