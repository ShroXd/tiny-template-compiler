import { MatchStack } from '../src/helpers/matchStack';
import { CommentNode, ElementNode, NodeTypes } from '../src/ast';

describe("matchStack", () => {
  it ("constructor", () => {
    const stack = new MatchStack();
    expect(stack.raw()).toEqual(true);
  })

  it ("is wrong type", () => {
    const comment = {
      type: NodeTypes.COMMENT,
      content: ""
    } as CommentNode
    const stack = new MatchStack();

    expect(stack.match(comment)).toEqual(false);
    expect(stack.match(comment)).toEqual(false);
    expect(stack.raw()).toEqual(true);
  })

  it ("is match", () => {
    const div = {
      type: NodeTypes.ELEMENT,
      content: "",
      tag: "div"
    } as ElementNode
    const stack = new MatchStack();

    expect(stack.match(div)).toEqual(false);
    expect(stack.match(div)).toEqual(true);
    expect(stack.raw()).toEqual(true);
  })

  it ("is not match", () => {
    const div = {
      type: NodeTypes.ELEMENT,
      content: "",
      tag: "div"
    } as ElementNode
    const span = {
      type: NodeTypes.ELEMENT,
      content: "",
      tag: "span"
    } as ElementNode
    const stack = new MatchStack();

    expect(stack.match(div)).toEqual(false);
    expect(stack.match(span)).toEqual(false);
    expect(stack.raw()).toEqual(false);
  })
})
