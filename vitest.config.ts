import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'happy-dom',
		exclude: [...configDefaults.exclude, 'e2e/*'],
		coverage: {
			include: ['src/**/*.ts', 'src/**/*.tsx'],
		},
	},
})
