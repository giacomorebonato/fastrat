import { fixupConfigRules } from '@eslint/compat'
import eslintConfigBiome from 'eslint-config-biome'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import { omit } from 'lodash-es'

export default [
	{
		ignores: ['package.json', 'dist/*', 'coverage/*'],
	},
	eslintConfigPrettier,
	...fixupConfigRules(reactRecommended),
	...fixupConfigRules(omit(eslintConfigBiome, 'extends')),
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'no-restricted-imports': ['error'],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
]
