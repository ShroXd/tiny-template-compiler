import { RootNode, TemplateBaseNode, ParentNode } from '../ast'
import { TransformOptions } from './transformOptions'

export interface transformContext extends Required<TransformOptions> {
  root: RootNode
  parent: ParentNode | null
  currentNode: RootNode | TemplateBaseNode | null
  childIndex: number
  removeNode(node?: TemplateBaseNode): void
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
