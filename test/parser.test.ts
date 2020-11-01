// @ts-ignore
import {compiler} from "../src";

describe("parser comment", () => {
    it ("normal comment", () => {
        const template = `
            <!-- comment -->
        `

        compiler(template)
    })
})
