import {
  createCodeGenerateNode,
  createObjectProperty,
  createSimpleExpression,
  ElementNode,
  ElementTypes,
  NodeTypes,
  ObjectExpression,
  PropsExpression,
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

    const vnodeTag = `"${tag}"`
    let vnodeProps: any
    let vnodeChildren: any

    if (props.length > 0) {
      const propsBuildResult = buildProps(node, context)
      vnodeProps = propsBuildResult.props
    }

    node.codeGenerateNode = createCodeGenerateNode(
      context,
      vnodeTag,
      vnodeProps,
      vnodeChildren,
      node.loc
    )
  }
}

export function buildProps(
  node: ElementNode,
  context: transformContext,
  props: any = node.props
) {
  const { tag, loc } = node
  const isComponent = node.tagType === ElementTypes.COMPONENT
  let properties: ObjectExpression['properties'] = []

  for (let i = 0; i < props.length; i++) {
    const prop = props[i]

    if (prop.type === NodeTypes.ATTRIBUTE) {
      const { name, value, loc } = prop
      properties.push()
    }
  }

  let propsExpression: PropsExpression | undefined

  return {
    props: propsExpression,
  }
}
