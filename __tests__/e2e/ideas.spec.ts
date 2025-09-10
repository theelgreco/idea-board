import { test, expect, Page } from "@playwright/test";

async function checkNumberOfIdeasInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction((e) => {
        return JSON.parse(localStorage.ideas).length === e;
    }, expected);
}

test.describe("Idea Board E2E", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should add, edit, persist, and delete ideas", async ({ page }) => {
        // Ensure "new idea" button is hidden after being clicked
        const newIdeaButton = page.getByRole("button", { name: "New Idea" });
        await expect(newIdeaButton).toBeVisible();
        await newIdeaButton.click();
        await expect(newIdeaButton).toBeHidden();

        // Add name
        await expect(page.getByRole("textbox", { name: "Enter idea name" })).toBeFocused();
        await page.getByRole("textbox", { name: "Enter idea name" }).fill("hello");
        await page.getByRole("textbox", { name: "Enter idea name" }).press("Enter");
        await expect(page.getByRole("textbox", { name: "Enter idea name" })).toHaveValue("hello");

        // Add description
        await expect(page.getByRole("textbox", { name: "What's your idea?" })).toBeFocused();
        await page.getByRole("textbox", { name: "What's your idea?" }).fill("world");
        await page.getByRole("textbox", { name: "What's your idea?" }).press("Shift+Enter");
        await expect(page.getByRole("textbox", { name: "What's your idea?" })).toHaveValue("world");

        // Edit name
        await page.getByRole("textbox", { name: "Enter idea name" }).fill("hellojwfnjff");
        await page.getByRole("textbox", { name: "Enter idea name" }).press("Enter");
        await expect(page.getByRole("textbox", { name: "Enter idea name" })).toHaveValue("hellojwfnjff");

        // Edit description
        await page.getByRole("textbox", { name: "What's your idea?" }).fill("worldjwdfnjj");
        await page.getByRole("textbox", { name: "What's your idea?" }).press("Shift+Enter");
        await expect(page.getByRole("textbox", { name: "What's your idea?" })).toHaveValue("worldjwdfnjj");

        // Reload page and ensure idea is still there
        await page.reload();
        await expect(page.getByRole("textbox", { name: "Enter idea name" })).toHaveValue("hellojwfnjff");
        await expect(page.getByRole("textbox", { name: "What's your idea?" })).toHaveValue("worldjwdfnjj");

        // Should have 1 idea
        await expect(page.getByRole("article")).toHaveCount(1);
        await checkNumberOfIdeasInLocalStorage(page, 1);

        // Delete idea
        await page.getByRole("article").locator("header").getByRole("button").click();

        // Should have no ideas
        await expect(page.getByRole("article")).toHaveCount(0);
        await checkNumberOfIdeasInLocalStorage(page, 0);
    });
});
