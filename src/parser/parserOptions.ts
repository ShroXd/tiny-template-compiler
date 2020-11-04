import { ElementNode } from '../ast'

export const enum DOMNamespaces {
  HTML,
  SVG,
}

export function getNamespace(
  tag: string,
  parent: ElementNode | undefined
): DOMNamespaces {
  const namespace = parent ? parent.namespace : DOMNamespaces.HTML

  if (namespace === DOMNamespaces.HTML) {
    if (tag === 'svg') {
      return DOMNamespaces.SVG
    }
  }

  return namespace
}
