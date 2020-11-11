import { parser } from './parser/parser'
import { transform } from './transform/transform'
import { getTransformPreset } from './transform/transformOptions'
import { extend, isString } from './utils'

export const compiler = (template: string, options = {}) => {
  // TODO 处理 template 非字符串的边界情况
  const ast = isString(template) ? parser(template) : template

  const [nodeTransforms] = getTransformPreset()
  transform(
    ast,
    extend({}, options, {
      nodeTransforms: [...nodeTransforms],
    })
  )
  // TODO generate code
}
