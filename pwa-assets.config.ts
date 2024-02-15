import {
	combinePresetAndAppleSplashScreens,
	defineConfig,
	minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
	headLinkOptions: {
		preset: '2023',
		basePath: '/',
	},
	preset: combinePresetAndAppleSplashScreens(
		{ ...minimal2023Preset },
		{
			// dark splash screens using black background (the default)
			darkResizeOptions: { background: 'black', fit: 'contain' },
			// or using a custom background color
			// darkResizeOptions: { background: '#1f1f1f' },
		},
		['iPad Air 9.7"'],
	),
	images: ['./public/logo.svg'],
})
