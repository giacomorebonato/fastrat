import Path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import appRootPath from 'app-root-path'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: [
		{
			// https://playwright.dev/docs/auth
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'tests',
			use: {
				...devices['Desktop Chrome'],
				storageState: Path.join(appRootPath.path, 'e2e', 'user.json'),
				screenshot: 'only-on-failure',
			},
			dependencies: ['setup'],
		},
	],

	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',

	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	testDir: './e2e',

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'pnpm build && pnpm start',
		reuseExistingServer: !process.env.CI,
		url: 'http://localhost:3000',
	},

	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
})
