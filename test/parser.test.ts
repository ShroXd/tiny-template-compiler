// @ts-ignore

import { tokenizer } from '../src/parser/parser'
import { CommentNode, NodeTypes } from '../src/ast'

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

    expect(comment).toStrictEqual({
      type: NodeTypes.COMMENT,
      content: 'abc',
      loc: {
        start: { line: 7, column: 58, offset: 57 },
        end: { line: 7, column: 68, offset: 67 },
      },
    })
  })

  it('not closed comment', () => {
    expect(() => {
      tokenizer('<!--ast')
    }).toThrow('Compiler error')
  })
})
