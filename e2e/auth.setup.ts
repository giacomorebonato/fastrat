import Path from 'node:path'
import { test as setup } from '@playwright/test'
import appRootPath from 'app-root-path'

setup('authenticate', async ({ page }) => {
	await page.goto('http://localhost:3000/login/google/ci')

	await page
		.context()
		.storageState({ path: Path.join(appRootPath.path, 'e2e', 'user.json') })
})
