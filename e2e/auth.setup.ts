import { env } from '#features/server/env'
import { test as setup, expect } from '@playwright/test'
import appRootPath from 'app-root-path'
import Path from 'node:path'

setup('authenticate', async ({ page }, testInfo) => {
	if (
		typeof env.TEST_EMAIL !== 'string' ||
		typeof env.TEST_PASSWORD !== 'string'
	) {
		throw Error(`User credentials are missing`)
	}

	await page.goto('http://localhost:3000')
	await page.getByTestId('btn-login').click()
	await page.getByText('Login with Google').click()

	const googleScreenshot = await page.screenshot()
	await testInfo.attach('screenshot', {
		body: googleScreenshot,
		contentType: 'image/png',
	})

	await page.locator('input[type=email]').fill(env.TEST_EMAIL)

	await page.getByText('Next').click()

	const screenshot = await page.screenshot()
	await testInfo.attach('screenshot', {
		body: screenshot,
		contentType: 'image/png',
	})

	await page.locator('input[type=password]').fill(env.TEST_PASSWORD)

	await page.getByText('Next').click()

	await page.waitForTimeout(10_000)

	const logoutScreenshot = await page.screenshot()
	await testInfo.attach('screenshot', {
		body: logoutScreenshot,
		contentType: 'image/png',
	})
	await expect(page.getByTestId('btn-logout')).toBeVisible()

	await page
		.context()
		.storageState({ path: Path.join(appRootPath.path, 'e2e', 'user.json') })
})
