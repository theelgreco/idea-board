import { describe, expect, test } from "vitest";

function testFunc() {
    return 1;
}

describe("hello", () => {
    test("Hello", () => {
        expect(testFunc()).toBe(1);
    });
});
