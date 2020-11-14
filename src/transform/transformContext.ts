import { RootNode, TemplateChildNode, ParentNode } from '../ast'
import { TransformOptions } from './transformOptions'

export interface transformContext extends Required<TransformOptions> {
  root: RootNode
  parent: ParentNode | null
  currentNode: RootNode | TemplateChildNode | null
  childIndex: number
  removeNode(node?: TemplateChildNode): void
}

export function createTransformContext(
  root: RootNode,
  { nodeTransforms = [] }: TransformOptions
): transformContext {
  return {
    // options
    nodeTransforms,

    root,
    parent: null,
    currentNode: root,
    childIndex: 0,

    // methods
    removeNode: () => {},
  }
}
