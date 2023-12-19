import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
	await page.goto('http://localhost:3000')

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/FastRat/)
})

test('get started link', async ({ page }) => {
	await page.goto('http://localhost:3000')

	// Click the get started link.
	await page.getByRole('link', { name: 'Get started' }).click()

	// Expects page to have a heading with the name of Installation.
	await expect(
		page.getByRole('heading', { name: 'Installation' }),
	).toBeVisible()
})
