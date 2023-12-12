/** @type {import("prettier").Config} */
module.exports = {
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	useTabs: true,
	arrowParens: 'always',
	trailingComma: 'all',
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-tailwindcss',
	],
}
