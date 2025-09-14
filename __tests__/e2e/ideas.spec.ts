import { test, expect } from "@playwright/test";

test.describe("Idea Board E2E", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should add, edit, persist, and delete ideas", async ({ page }) => {
        const ideaName = "hello";
        const ideaDescription = "world";
        const editedIdeaName = "hellojwfnjff";
        const editedIdeaDescription = "worldjwdfnjj";

        const newIdeaButton = page.getByRole("button", { name: "New Idea" });
        const ideaNameElement = page.getByRole("textbox", { name: "Enter idea name" });
        const ideaDescriptionElement = page.getByRole("textbox", { name: "What's your idea?" });

        // Ensure "new idea" button is hidden after being clicked
        await expect(newIdeaButton).toBeVisible();
        await newIdeaButton.click();
        await expect(newIdeaButton).toBeHidden();

        // Add name
        await expect(ideaNameElement).toBeFocused();
        await ideaNameElement.fill(ideaName);
        await ideaNameElement.press("Enter");
        await expect(ideaNameElement).toHaveValue(ideaName);

        // Add description
        await expect(ideaDescriptionElement).toBeFocused();
        await ideaDescriptionElement.fill(ideaDescription);
        await ideaDescriptionElement.press("Shift+Enter");
        await expect(ideaDescriptionElement).toHaveValue(ideaDescription);

        // Edit name
        await ideaNameElement.fill(editedIdeaName);
        await ideaNameElement.press("Enter");
        await expect(ideaNameElement).toHaveValue(editedIdeaName);

        // Edit description
        await ideaDescriptionElement.fill(editedIdeaDescription);
        await ideaDescriptionElement.press("Shift+Enter");
        await expect(ideaDescriptionElement).toHaveValue(editedIdeaDescription);

        // Reload page and ensure idea is still there
        await page.reload();
        await expect(ideaNameElement).toHaveValue(editedIdeaName);
        await expect(ideaDescriptionElement).toHaveValue(editedIdeaDescription);

        // Should have 1 idea
        await expect(page.getByRole("article")).toHaveCount(1);

        // Delete idea
        await page.getByRole("article").locator("header").getByRole("button").click();

        // Should have no ideas
        await expect(page.getByRole("article")).toHaveCount(0);
    });
});
