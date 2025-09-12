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

    test("should add, edit, persist, and delete collections", async ({ page }) => {
        const addCollectionButton = page.getByRole("button", { name: "Add Collection" });
        await expect(addCollectionButton).toBeEnabled();
        await addCollectionButton.click();
        await expect(addCollectionButton).toBeDisabled();

        /* Add collection */
        page.getByRole("textbox", { name: "Enter Collection Name" }).fill("My collection");
        await expect(page.getByRole("textbox", { name: "Enter Collection Name" })).toHaveValue("My collection");
        await page.getByRole("textbox", { name: "Enter Collection Name" }).press("Enter");
        await expect(page.getByRole("button", { name: "My collection" })).toBeVisible();
        await checkNumberOfCollectionsInLocalStorage(page, 1);

        /* Edit collection */
        await page.getByRole("button", { name: "My collection" }).getByRole("button").nth(0).click();
        await page.getByRole("textbox", { name: "Enter Collection Name" }).fill("My edited collection");
        await expect(page.getByRole("textbox", { name: "Enter Collection Name" })).toHaveValue("My edited collection");
        await page.getByRole("textbox", { name: "Enter Collection Name" }).press("Enter");
        await expect(page.getByRole("button", { name: "My edited collection" })).toBeVisible();
        await checkNumberOfCollectionsInLocalStorage(page, 1);

        /* Reload page and ensure collection is still there */
        await page.reload();
        await expect(page.getByRole("button", { name: "My edited collection" })).toBeVisible();

        /* Delete collection */
        await page.getByRole("button", { name: "My edited collection" }).click();
        await page.getByRole("button", { name: "My edited collection" }).getByRole("button").nth(1).click();
        await checkNumberOfCollectionsInLocalStorage(page, 0);
    });
});
