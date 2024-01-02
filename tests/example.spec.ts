import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
	await page.goto('http://localhost:3000')

	await expect(page).toHaveTitle(/FastRat/)
})

test('login link', async ({ page }) => {
	await page.goto('http://localhost:3000')

	await page.getByTestId('btn-login').click()

	await page.getByText('Login with Google').click()
})

test('creates a note', async ({ page }) => {
	await page.goto('http://localhost:3000')

	await page.getByText('Create Note').click()

	await page.getByText('Write something')
})
