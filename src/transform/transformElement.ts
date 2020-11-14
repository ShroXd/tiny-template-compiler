import {
  ElementTypes,
  NodeTypes,
  RootNode,
  TemplateChildNode,
  VNodeCall,
} from '../ast'
import { transformContext } from './transformContext'
import { NodeTransform } from './transformOptions'

export const transformElement: NodeTransform = (node, context) => {
  if (
    !(
      node.type === NodeTypes.ELEMENT &&
      (node.tagType === ElementTypes.ELEMENT ||
        node.tagType === ElementTypes.COMPONENT)
    )
  ) {
    return
  }

  // 外层递归的产出退出函数
  // 目的是先解析嵌套较深的节点，再解析嵌套较浅的节点
  return function realTransformElement() {
    const { tag, props } = node
    const isComponent = node.tagType === ElementTypes.COMPONENT

    let vnodeProps: any
    let vnodeChildren: any

    if (props.length > 0) {
      const propsBuildResult = buildProps(node, context)
    }
  }
}

export function buildProps(
  node: RootNode | TemplateChildNode,
  context: transformContext
) {}
