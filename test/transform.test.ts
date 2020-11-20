import { isString } from '../src/utils'
import { parser } from '../src/parser/parser'
import { transform } from '../src/transform/transform'
import { transformElement } from '../src/transform/transformElement'

function parseWithTransform(template: string, options = {}) {
  const ast = isString(template) ? parser(template) : template
  return transform(ast, {
    nodeTransforms: [transformElement],
  })
}

describe('Element', () => {})
