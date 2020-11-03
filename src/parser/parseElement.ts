import { NodeTypes, ElementNode } from "../ast";

export function parseElement(): ElementNode {
    return {
        type: NodeTypes.ELEMENT,
        content: "",
        tag: "",
        loc: {
            start: { line: 1, column: 1, offset: 1 },
            end: { line: 1, column: 1, offset: 1 }
        }
    }
}