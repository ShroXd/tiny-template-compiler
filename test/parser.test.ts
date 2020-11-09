// @ts-ignore

import { tokenizer } from '../src/parser/parser'
import { CommentNode, ElementNode, NodeTypes } from '../src/ast'

describe('Normal Comment (good running)', () => {
  it('is empty comment', () => {
    const ast = tokenizer('<!---->')
    const comment = ast[0] as CommentNode

    expect(comment).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: '',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 8, offset: 7 },
      },
    })
  })

  it('is simple comment', () => {
    const ast = tokenizer('<!--abc-->')
    const comment = ast[0] as CommentNode

    expect(comment).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: 'abc',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 11, offset: 10 },
      },
    })
  })

  it('is multi comment', () => {
    const ast = tokenizer('<!--abc--><!--def-->')
    const comment1 = ast[0] as CommentNode
    const comment2 = ast[1] as CommentNode

    expect(comment1).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: 'abc',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 11, offset: 10 },
      },
    })
    expect(comment2).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: 'def',
      loc: {
        start: { line: 1, column: 11, offset: 10 },
        end: { line: 1, column: 21, offset: 20 },
      },
    })
  })

  it('can skip witespace', () => {
    const ast = tokenizer(`
                
        
        aa

        a
        <!--abc-->
        `)
    const text = ast[0]
    const comment = ast[1]

    expect(text).toStrictEqual({
      type: 2,
      content: ' aa a ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 7, column: 58, offset: 57 },
      },
    })
    expect(comment).toStrictEqual({
      type: 3,
      content: 'abc',
      loc: {
        start: { line: 7, column: 58, offset: 57 },
        end: { line: 7, column: 68, offset: 67 },
      },
    })
  })
})

describe('Bogus Comment (good running)', () => {
  it('is bogus comment', () => {
    const template = `<!DOCTYPE-->`
    expect(() => {
      tokenizer(template)
    }).not.toThrow()
  })
})

describe('CDATA (good running)', () => {
  it('is CDATA', () => {
    const template = `<![CDATA[`
    expect(() => {
      tokenizer(template)
    }).not.toThrow()
  })
})

describe('Comment (error)', () => {
  it('is incorrectly closed comment', () => {
    const template = `<!-nothing`
    expect(() => {
      tokenizer(template)
    }).toThrow('Compiler error')
  })
})

describe('Element (good running)', () => {
  it('is simple empty element', () => {
    const template = `<div></div>`
    const ast = tokenizer(template)
    const element = ast[0] as ElementNode

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 12, offset: 11 },
      },
    })
  })

  it('is simple element with text', () => {
    const template = `<div>Hello World</div>`
    const ast = tokenizer(template)
    const element = ast[0] as ElementNode

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 2,
          content: 'Hello World',
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 17, offset: 16 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 23, offset: 22 },
      },
    })
  })

  it('is nested element', () => {
    const template = `<div><span></span></div>`
    const ast = tokenizer(template)
    const element = ast[0] as ElementNode

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 1,
          namespace: 0,
          tag: 'span',
          tagType: 3,
          props: [],
          isSelfClosing: false,
          children: [],
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 19, offset: 18 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 25, offset: 24 },
      },
    })
  })

  it('is nested element with text', () => {
    const template = `<div><span>Nice</span></div>`
    const ast = tokenizer(template)
    const element = ast[0] as ElementNode

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 1,
          namespace: 0,
          tag: 'span',
          tagType: 3,
          props: [],
          isSelfClosing: false,
          children: [
            {
              type: 2,
              content: 'Nice',
              loc: {
                start: { line: 1, column: 12, offset: 11 },
                end: { line: 1, column: 16, offset: 15 },
              },
            },
          ],
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 23, offset: 22 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 29, offset: 28 },
      },
    })
  })

  it('is multi elements', () => {
    const template = `<div>First</div><div>Second</div>`
    const ast = tokenizer(template)
    const element1 = ast[0] as ElementNode
    const element2 = ast[1] as ElementNode

    expect(ast.length).toEqual(2)
    expect(element1).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 2,
          content: 'First',
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 11, offset: 10 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 17, offset: 16 },
      },
    })
    expect(element2).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 2,
          content: 'Second',
          loc: {
            start: { line: 1, column: 22, offset: 21 },
            end: { line: 1, column: 28, offset: 27 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 17, offset: 16 },
        end: { line: 1, column: 34, offset: 33 },
      },
    })
  })

  it('is nested multi elements', () => {
    const template = `<div><span></span><span></span></div>`
    const ast = tokenizer(template)
    const element = ast[0]

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 1,
          namespace: 0,
          tag: 'span',
          tagType: 3,
          props: [],
          isSelfClosing: false,
          children: [],
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 19, offset: 18 },
          },
        },
        {
          type: 1,
          namespace: 0,
          tag: 'span',
          tagType: 3,
          props: [],
          isSelfClosing: false,
          children: [],
          loc: {
            start: { line: 1, column: 19, offset: 18 },
            end: { line: 1, column: 32, offset: 31 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 38, offset: 37 },
      },
    })
  })

  it('handle whitespace node', () => {
    const template = `  
    <div>  
    
    <span>  
    Nice</span> </div>`
    const ast = tokenizer(template)
    const element = ast[0] as ElementNode

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 1,
          namespace: 0,
          tag: 'span',
          tagType: 3,
          props: [],
          isSelfClosing: false,
          children: [
            {
              type: 2,
              content: ' Nice',
              loc: {
                start: { line: 4, column: 31, offset: 30 },
                end: { line: 5, column: 42, offset: 41 },
              },
            },
          ],
          loc: {
            start: { line: 4, column: 25, offset: 24 },
            end: { line: 5, column: 49, offset: 48 },
          },
        },
      ],
      loc: {
        start: { line: 2, column: 8, offset: 7 },
        end: { line: 5, column: 56, offset: 55 },
      },
    })
  })

  it('has extra text', () => {
    const template = `
    Hello World
    <div>Hello Vue</div>
    `
    const ast = tokenizer(template)
    const text = ast[0]
    const element = ast[1]

    expect(ast.length).toEqual(2)
    expect(text).toStrictEqual({
      type: 2,
      content: ' Hello World ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 3, column: 22, offset: 21 },
      },
    })
    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 2,
          content: 'Hello Vue',
          loc: {
            start: { line: 3, column: 27, offset: 26 },
            end: { line: 3, column: 36, offset: 35 },
          },
        },
      ],
      loc: {
        start: { line: 3, column: 22, offset: 21 },
        end: { line: 3, column: 42, offset: 41 },
      },
    })
  })
})

describe('Element (error)', () => {
  it('is EOF before tag name', () => {
    const template = `</`
    expect(() => {
      tokenizer(template)
    }).toThrow('Compiler error') // TODO 增加 text mode
  })

  it('is missing end tag name', () => {
    const template = `</>`
    expect(() => {
      tokenizer(template)
    }).toThrow('Compiler error')
  })

  it('is invalid first character of tag name', () => {
    const template = `<//>`
    expect(() => {
      tokenizer(template)
    }).toThrow('Compiler error')
  })

  it('is end tag first', () => {
    const template = `</div>`
    const ast = tokenizer(template)

    expect(ast.length).toEqual(0)
  })
})

describe('Interpolation (good running)', () => {
  it('is simple variable', () => {
    const template = `<div>{{ name }}</div>`
    const ast = tokenizer(template)
    const element = ast[0]

    expect(element).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [],
      isSelfClosing: false,
      children: [
        {
          type: 5,
          content: {
            type: 6,
            content: 'name',
            loc: {
              start: { line: 1, column: 8, offset: 7 },
              end: { line: 1, column: 14, offset: 13 },
            },
          },
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 16, offset: 15 },
          },
        },
      ],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 22, offset: 21 },
      },
    })
  })
})

describe('Attributes', () => {
  it('is simple single attribute', () => {
    const template = `<div class="title"></div>`
    const ast = tokenizer(template)
    const attr = ast[0]

    expect(attr).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [
        {
          type: 4,
          name: 'class',
          value: {
            type: 2,
            content: 'title',
            loc: {
              start: { line: 1, column: 12, offset: 11 },
              end: { line: 1, column: 19, offset: 18 },
            },
          },
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 19, offset: 18 },
          },
        },
      ],
      isSelfClosing: false,
      children: [],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 26, offset: 25 },
      },
    })
  })

  it('is multi attributes', () => {
    const template = `<div class="title" align="center"></div>`
    const ast = tokenizer(template)
    const attr = ast[0]

    expect(attr).toStrictEqual({
      type: 1,
      namespace: 0,
      tag: 'div',
      tagType: 3,
      props: [
        {
          type: 4,
          name: 'class',
          value: {
            type: 2,
            content: 'title',
            loc: {
              start: { line: 1, column: 12, offset: 11 },
              end: { line: 1, column: 19, offset: 18 },
            },
          },
          loc: {
            start: { line: 1, column: 6, offset: 5 },
            end: { line: 1, column: 19, offset: 18 },
          },
        },
        {
          type: 4,
          name: 'align',
          value: {
            type: 2,
            content: 'center',
            loc: {
              start: { line: 1, column: 26, offset: 25 },
              end: { line: 1, column: 34, offset: 33 },
            },
          },
          loc: {
            start: { line: 1, column: 20, offset: 19 },
            end: { line: 1, column: 34, offset: 33 },
          },
        },
      ],
      isSelfClosing: false,
      children: [],
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 41, offset: 40 },
      },
    })
  })
})
