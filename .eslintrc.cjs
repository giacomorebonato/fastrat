// https://cpojer.net/posts/fastest-frontend-tooling-in-2022

module.exports = {
	"plugins": ["prettier"],
	ignorePatterns: [
		'dist/',
		'.eslintrc.cjs',
		'tailwind.config.js',
		'drizzle.config.ts',
		'.prettierrc.cjs',
		'package.json',
		'tsconfig.json'
	],
	extends: ['@nkzw'],
	rules: {
		"prettier/prettier": "error",
		'space-before-function-paren': 0,
		'import/no-unresolved': 0,
		'@typescript-eslint/no-explicit-any': 0,
	},
}
