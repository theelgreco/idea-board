import { test, expect, Page } from "@playwright/test";

const IDEAS = [
    { name: "My Great Idea", description: "I've had a great idea!" },
    { name: "Another Great Idea", description: "I've had another great idea!" },
    { name: "My Final Great Idea", description: "I've had my final great idea!" },
];

const NAME_PLACEHOLDER = "Enter idea name";
const DESCRIPTION_PLACEHOLDER = "What's your idea?";

async function checkNumberOfIdeasInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction((e) => {
        return JSON.parse(localStorage.ideas).length === e;
    }, expected);
}

async function createDefaultIdeas(page: Page) {
    for (const idea of IDEAS) {
        await page.getByTestId("add-idea-btn").click();

        await page.getByPlaceholder(NAME_PLACEHOLDER).fill(idea.name);
        await page.getByPlaceholder(NAME_PLACEHOLDER).press("Enter");

        await page.getByRole("paragraph").filter({ hasText: DESCRIPTION_PLACEHOLDER }).click();
        await page.getByPlaceholder(DESCRIPTION_PLACEHOLDER).fill(idea.description);
        await page.getByPlaceholder(DESCRIPTION_PLACEHOLDER).press("Shift+Enter");
    }
}

test.describe("Idea Board E2E", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        // Clear localStorage or reset state if needed
        await page.evaluate(() => localStorage.clear());
    });

    test("should add, edit, persist, and delete ideas", async ({ page }) => {
        // Add name
        await page.getByRole("button", { name: "New Idea" }).click();
        await page.getByRole("textbox", { name: "Enter idea name" }).fill("hello");
        await page.getByRole("textbox", { name: "Enter idea name" }).press("Enter");
        // Add description
        await page.getByRole("textbox", { name: "What's your idea?" }).click();
        await page.getByRole("textbox", { name: "What's your idea?" }).fill("world");
        await page.getByRole("textbox", { name: "What's your idea?" }).press("Shift+Enter");
        // Edit name
        await page.getByRole("textbox", { name: "Enter idea name" }).click();
        await page.getByRole("textbox", { name: "Enter idea name" }).fill("hellojwfnjff");
        await page.getByRole("textbox", { name: "Enter idea name" }).press("Enter");
        // Edit description
        await page.getByRole("textbox", { name: "What's your idea?" }).click();
        await page.getByRole("textbox", { name: "What's your idea?" }).fill("worldjwdfnjj");
        await page.getByRole("textbox", { name: "What's your idea?" }).press("Shift+Enter");
        // Reload page and ensure idea is still there
        await page.reload();
        // Delete idea
        await page.getByRole("article").locator("header").getByRole("button").click();
    });
});
