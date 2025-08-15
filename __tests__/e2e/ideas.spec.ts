import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

const IDEAS = [
    { name: "My Great Idea", description: "I've had a great idea!" },
    { name: "Another Great Idea", description: "I've had another great idea!" },
    { name: "My Final Great Idea", description: "I've had my final great idea!" },
];

const IDEA_TEST_ID = "idea";
const NAME_TEST_ID = "idea-name";
const DESCRIPTION_TEST_ID = "idea-description";
const NAME_PLACEHOLDER = "Enter idea name";
const DESCRIPTION_PLACEHOLDER = "What's your idea?";

test.describe("Create Idea", () => {
    test("Should be able to add a new idea", async ({ page }) => {
        // Click new idea button
        await page.getByTestId("add-idea-btn").click();

        // Add name
        await page.getByPlaceholder(NAME_PLACEHOLDER).fill(IDEAS[0].name);
        await page.getByPlaceholder(NAME_PLACEHOLDER).press("Enter");

        // Click description
        await page.getByRole("paragraph").filter({ hasText: DESCRIPTION_PLACEHOLDER }).click();
        await page.getByPlaceholder(DESCRIPTION_PLACEHOLDER).fill(IDEAS[0].description);
        await page.getByPlaceholder(DESCRIPTION_PLACEHOLDER).press("Shift+Enter");

        const ideas = page.getByTestId(IDEA_TEST_ID);

        // Check only 1 idea added
        await expect(ideas).toHaveCount(1);
        await expect(ideas.first()).toBeVisible();
        await expect(ideas.first().getByTestId(NAME_TEST_ID)).toHaveText(IDEAS[0].name);
        await expect(ideas.first().getByTestId(DESCRIPTION_TEST_ID)).toHaveText(IDEAS[0].description);

        // Check localstorage contains only one idea
        await checkNumberOfIdeasInLocalStorage(page, 1);
    });

    test("Should not add idea when name input is empty", async ({ page }) => {
        // Test 'Enter' key press
        await page.getByTestId("add-idea-btn").click();
        await page.getByPlaceholder(NAME_PLACEHOLDER).press("Enter");
        await expect(page.getByPlaceholder(NAME_PLACEHOLDER)).not.toBeVisible();

        // Test 'Escape' key press
        await page.getByTestId("add-idea-btn").click();
        await page.getByPlaceholder(NAME_PLACEHOLDER).press("Escape");
        await expect(page.getByPlaceholder(NAME_PLACEHOLDER)).not.toBeVisible();
    });
});

test.describe("Edit Idea", () => {
    test.beforeEach(async ({ page }) => {
        await createDefaultIdeas(page);
    });

    test("Should be able to edit existing idea's name", async ({ page }) => {
        const ideas = page.getByTestId(IDEA_TEST_ID);

        const newName = "New Idea Name";

        await ideas.first().getByTestId(NAME_TEST_ID).click();
        await ideas.first().getByPlaceholder(NAME_PLACEHOLDER).fill(newName);
        await ideas.first().press("Enter");

        await expect(ideas.first().getByTestId(NAME_TEST_ID)).toHaveText(newName);
    });

    test("Should be able to edit existing idea's description", async ({ page }) => {
        const ideas = page.getByTestId(IDEA_TEST_ID);

        const newDescription = "This is a new idea description!";

        await ideas.first().getByTestId(DESCRIPTION_TEST_ID).click();
        await ideas.first().getByPlaceholder(DESCRIPTION_PLACEHOLDER).fill(newDescription);
        await ideas.first().getByPlaceholder(DESCRIPTION_PLACEHOLDER).press("Shift+Enter");

        await expect(ideas.first().getByTestId(DESCRIPTION_TEST_ID)).toHaveText(newDescription);
    });

    test("Should not change name if input is empty", async ({ page }) => {
        const ideas = page.getByTestId(IDEA_TEST_ID);

        const ideaDescription = await ideas.first().getByTestId(NAME_TEST_ID).innerText();

        // Replace name with empty string
        await ideas.first().getByTestId(NAME_TEST_ID).click();
        await ideas.first().getByPlaceholder(NAME_PLACEHOLDER).fill("");
        await ideas.first().getByPlaceholder(NAME_PLACEHOLDER).press("Shift+Enter");

        // Should have original description
        await expect(ideas.first().getByTestId(NAME_TEST_ID)).toHaveText(ideaDescription);
    });
});

test.describe("Delete Idea", () => {
    test.beforeEach(async ({ page }) => {
        await createDefaultIdeas(page);
    });

    test("Should be able to delete an idea", async ({ page }) => {
        const ideasBeforeDelete = page.getByTestId(IDEA_TEST_ID);
        await expect(ideasBeforeDelete).toHaveCount(IDEAS.length);

        await ideasBeforeDelete.nth(1).getByTestId("idea-delete").click();

        // Check that the idea has been removed from the list
        const ideasAfterDelete = page.getByTestId(IDEA_TEST_ID);
        await expect(ideasAfterDelete).toHaveCount(IDEAS.length - 1);

        // Check that the idea has been removed from localStorage
        await checkNumberOfIdeasInLocalStorage(page, IDEAS.length - 1);
    });
});

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
