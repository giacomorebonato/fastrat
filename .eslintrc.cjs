module.exports = {
	settings: {
		react: {
			version: '^18.2.0',
		},
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.cjs'],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			files: ['*.ts', '*.js', '*.tsx', '*.jsx'],
			extends: ['biome', 'plugin:drizzle/all'],
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
		'@tanstack/query',
		'react',
		'no-relative-import-paths',
	],
	rules: {
		'react/react-in-jsx-scope': 0,

		'no-relative-import-paths/no-relative-import-paths': [
			'warn',
			{ allowSameFolder: true, prefix: '#', rootDir: 'src' },
		],
	},
	ignorePatterns: [
		'node_modules/',
		'e2e/user.json',
		'coverage/',
		'dist/',
		'vite.config.ts*',
		'vitest.config.ts*',
	],
}
