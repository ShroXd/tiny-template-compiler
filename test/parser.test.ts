// @ts-ignore

import { tokenizer } from '../src/parser/parser'
import { CommentNode, ElementNode, NodeTypes } from '../src/ast'

describe('Comment', () => {
  it('empty comment', () => {
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

  it('simple comment', () => {
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

  it('multi comment', () => {
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

  it('skip witespace', () => {
    const ast = tokenizer(`
                
        
        aa

        a
        <!--abc-->
        `)
    const comment = ast[0] as CommentNode
    console.log(JSON.stringify(comment))

    expect(comment).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: ' aa a ',
      loc: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 7, column: 58, offset: 57 },
      },
    })
  })

  it('not closed comment', () => {
    expect(() => {
      tokenizer('<!--ast')
    }).toThrow('Compiler error')
  })
})

describe('Element', () => {
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
})
