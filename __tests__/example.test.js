import { describe, expect, test } from "@jest/globals";

function testFunc() {
    return 1;
}

describe("hello", () => {
    test("Hello", () => {
        expect(testFunc()).toBe(1);
    });
});
