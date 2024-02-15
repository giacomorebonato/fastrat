import mdx from '@mdx-js/rollup'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { vavite } from 'vavite'
import { type UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { splitVendorChunkPlugin } from 'vite'

const config: UserConfig = {
	resolve: {
		alias: {
			lodash: 'lodash-es',
		},
	},
	buildSteps: [
		{
			name: 'client',
			config: {
				build: {
					outDir: 'dist/client',
					manifest: true,
					rollupOptions: {
						output: {
							manualChunks(id: string) {
								if (
									id.includes('react-toastify') ||
									id.includes('framer-motion') ||
									id.includes('react-helmet-async')
								) {
									return 'react-libs'
								}
								if (id.includes('@tanstack') || id.includes('@trpc')) {
									return '@tanstack'
								}
							},
						},
					},
				},
			},
		},
		{
			name: 'server',
			config: {
				build: {
					target: 'node21',
					ssr: true,
					outDir: 'dist/server',
					rollupOptions: {
						onwarn(warning, handler) {
							if (
								warning.message.includes('is dynamically imported by') &&
								warning.message.includes(
									'dynamic import will not move module into another chunk',
								)
							) {
								return
							}

							handler(warning)
						},
					},
				},
			},
		},
	],
	plugins: [
		VitePWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			workbox: {
				maximumFileSizeToCacheInBytes: 10_000_000,
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				navigateFallbackDenylist: [/^\/login\/google/],
			},
			devOptions: {
				enabled: false, // https://vite-pwa-org.netlify.app/guide/development
			},
			manifest: {
				name: 'FastRat',
				icons: [
					{
						src: 'src/images/logo-64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'src/images/logo-180.png',
						sizes: '180x180',
						type: 'image/png',
					},
					{
						src: 'src/images/logo-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'src/images/logo-256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'src/images/logo-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'src/images/logo-1024.png',
						sizes: '1024x1024',
						type: 'image/png',
					},
				],
			},
		}),
		mdx(),
		vavite({
			reloadOn: 'static-deps-change',
			serverEntry: 'src/index.ts',
			handlerEntry: 'src/handler.ts',
			serveClientAssetsInDev: true,
		}),
		react(),
		splitVendorChunkPlugin(),
		TanStackRouterVite({
			quoteStyle: 'single',
		}),
	],
	ssr: {
		noExternal: ['react-helmet-async'],
	},
}

export default config
