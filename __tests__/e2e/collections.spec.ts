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

        // Add collection
        page.getByRole("textbox", { name: "Enter Collection Name" }).fill("My collection");
        await page.getByRole("textbox", { name: "Enter Collection Name" }).press("Enter");
        await expect(page.getByRole("textbox", { name: "Enter Collection Name" })).toHaveValue("My collection");
        await checkNumberOfCollectionsInLocalStorage(page, 1);

        // Edit collection
        await page.getByRole("button", { name: "My collection" }).getByRole("button").nth(0).click();
        await page.getByRole("textbox", { name: "Enter Collection Name" }).fill("My collection edited");
        await expect(page.getByRole("textbox", { name: "Enter Collection Name" })).toHaveValue("My collection edited");

        // Delete collection
        await page.getByRole("button", { name: "My collection edited" }).getByRole("button").nth(1).click();
        await checkNumberOfCollectionsInLocalStorage(page, 0);
    });
});
