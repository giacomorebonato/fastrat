import Path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import appRootPath from 'app-root-path'

process.env.DATABASE_URL = ':memory:'
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

	reporter: 'html',
	retries: process.env.CI ? 2 : 0,

	testDir: './e2e',

	use: {
		trace: 'on-first-retry',
	},
	webServer: {
		command:
			'node --run clean && ENABLE_SOURCEMAPS=true node --run build && node --run start',
		reuseExistingServer: !process.env.CI,
		url: 'http://localhost:3000',
	},

	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	globalSetup: 'e2e/global.setup.ts',
	globalTeardown: 'e2e/global.teardown.ts',
})
