// @ts-ignore

import { tokenizer } from '../src/parser';

describe("Comment", () => {
    it("empty comment", () => {
        const ast = tokenizer("<!---->")
    })
})
