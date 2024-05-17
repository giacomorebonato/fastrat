import { fixupConfigRules } from '@eslint/compat'
import eslintConfigBiome from 'eslint-config-biome'
import eslintConfigPrettier from 'eslint-config-prettier'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import { omit } from 'lodash-es'

export default [
	...fixupConfigRules(reactRecommended),
	eslintConfigPrettier,
	...fixupConfigRules(omit(eslintConfigBiome, 'extends')),
	{
		ignores: ['package.json', 'dist/*', 'coverage/*'],
		plugins: {
			'no-relative-import-paths': noRelativeImportPaths,
		},
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
			'react/display-name': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'no-restricted-imports': ['error'],
			'no-relative-import-paths/no-relative-import-paths': [
				'error',
				{ allowSameFolder: true, rootDir: 'src', prefix: '#' },
			],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
]
