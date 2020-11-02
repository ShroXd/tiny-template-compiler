// @ts-ignore

import { tokenizer } from '../src/parser/parser';

describe("Comment", () => {
    it("empty comment", () => {
        const ast = tokenizer("<!---->")
    })
})
