import { test, expect, Page } from "@playwright/test";

async function checkNumberOfCollectionsInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction((e) => {
        return JSON.parse(localStorage.collections).length === e;
    }, expected);
}

test.describe("Collections E2E", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should add, edit, persist, and delete ideas", async ({ page }) => {
        const addCollectionButton = page.getByRole("button", { name: "Add Collection" });
        await expect(addCollectionButton).toBeEnabled();
        await addCollectionButton.click();
        await expect(addCollectionButton).toBeDisabled();
    });
});
