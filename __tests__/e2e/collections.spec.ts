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
        const collectionName = "My Collection";
        const editedCollectionName = "My Edited Collection";

        const addCollectionButton = page.getByRole("button", { name: "Add Collection" });
        const collectionInputElement = page.getByRole("textbox", { name: "Enter Collection Name" });
        const collectionElement = page.getByRole("button", { name: collectionName });
        const collectionEditButton = collectionElement.getByRole("button").nth(0);
        // After editing, the collection will have a new name, so we need a separate locator for the edited collection button
        const editedCollectionElement = page.getByRole("button", { name: editedCollectionName });
        const editedCollectionDeleteButton = editedCollectionElement.getByRole("button").nth(1);

        await expect(addCollectionButton).toBeEnabled();
        await addCollectionButton.click();
        await expect(addCollectionButton).toBeDisabled();

        /* Add collection */
        await collectionInputElement.fill(collectionName);
        await collectionInputElement.press("Enter");
        await expect(collectionInputElement).toHaveValue(collectionName);
        await expect(collectionInputElement).toBeVisible();
        await checkNumberOfCollectionsInLocalStorage(page, 1);

        /* Edit collection */
        await collectionEditButton.click();
        await collectionInputElement.fill(editedCollectionName);
        await collectionInputElement.press("Enter");
        await expect(collectionInputElement).toHaveValue(editedCollectionName);
        await expect(collectionInputElement).toBeVisible();
        await checkNumberOfCollectionsInLocalStorage(page, 1);

        /* Reload page and ensure collection is still there and has edited value */
        await page.reload();
        await expect(editedCollectionElement).toBeVisible();
        await expect(collectionInputElement).toHaveValue(editedCollectionName);

        /* Delete collection */
        await editedCollectionElement.click();
        await editedCollectionDeleteButton.click();
        await checkNumberOfCollectionsInLocalStorage(page, 0);
    });
});
