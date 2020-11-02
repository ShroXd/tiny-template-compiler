import { NodeTypes, TemplateNode } from '../ast';

const closeTag = ["img", "br"]

export class MatchStack {
  private readonly stack: TemplateNode[]

  constructor() {
    this.stack = []
  }

  match(el: TemplateNode): boolean {
    if (this.stack.length < 1) {
      this.push(el)
      return false
    }

    const prev = this.stack[this.stack.length - 1]
    if (el.tag === prev.tag) {
      this.stack.pop()
      return true
    } else {
      this.push(el)
      return false
    }
  }

  raw(): boolean {
    return this.stack.length === 0
  }

  private push(el: TemplateNode): void {
    if (el.type !== NodeTypes.ELEMENT || (el.tag && closeTag.indexOf(el.tag) !== -1)) {
      return
    }
    this.stack.push(el)
  }
}