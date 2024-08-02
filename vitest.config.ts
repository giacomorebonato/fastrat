import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		exclude: [...configDefaults.exclude, 'e2e/*'],
		coverage: {
			include: ['src/**/*.ts'],
		},
	},
})
