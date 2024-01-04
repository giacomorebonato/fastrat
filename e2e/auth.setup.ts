import { env } from '#features/server/env'
import { test as setup, expect } from '@playwright/test'
import appRootPath from 'app-root-path'
import Path from 'node:path'

setup('authenticate', async ({ page }, testInfo) => {
	await page.goto('http://localhost:3000')
	await page.getByTestId('btn-login').click()
	await page.getByText('Login with Google').click()

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	await page.locator('input[type=email]').fill(env.TEST_EMAIL!)

	await page.getByText('Next').click()

	const screenshot = await page.screenshot()
	await testInfo.attach('screenshot', {
		body: screenshot,
		contentType: 'image/png',
	})

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	await page.locator('input[type=password]').fill(env.TEST_PASSWORD!)

	await page.getByText('Next').click()
	await page.waitForTimeout(10_000)

	await expect(page.getByTestId('btn-logout')).toBeVisible()

	await page
		.context()
		.storageState({ path: Path.join(appRootPath.path, 'e2e', 'user.json') })
})
