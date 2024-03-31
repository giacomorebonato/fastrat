module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
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
			extends: ['biome'],
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'react'],
	rules: {
		'react/react-in-jsx-scope': 0,
	},
}
