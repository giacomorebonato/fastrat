import mdx from '@mdx-js/rollup'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { vavite } from 'vavite'
import type { UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
	buildSteps: [
		{
			name: 'client',
			config: {
				build: {
					outDir: 'dist/client',
					manifest: true,
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
			// https://vite-pwa-org.netlify.app/workbox/generate-sw.html
			strategies: 'generateSW',
			registerType: 'prompt',
			workbox: {
				maximumFileSizeToCacheInBytes: 10_000_000,
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
				navigateFallbackDenylist: [/^\/login\/google/],
				navigateFallback: '/index.html',
			},
			devOptions: {
				enabled: false, // https://vite-pwa-org.netlify.app/guide/development
				suppressWarnings: false,
				type: 'module',
				navigateFallback: '/index.html',
			},
			manifest: {
				theme_color: '#F4E2CA',
				name: 'FastRat',
				short_name: 'FastRat',
				description:
					'A starter kit with great DX for building PWA with Fastify + React',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				screenshots: [
					{
						src: 'wide-screenshot.webp',
						sizes: '1232x720',
						type: 'image/webp',
						form_factor: 'wide',
						label: 'Homescreen of FastRat',
					},
					{
						src: 'mobile-screenshot.webp',
						sizes: '1046x1150',
						type: 'image/webp',
						label: 'Homescreen of FastRat',
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
		TanStackRouterVite({
			quoteStyle: 'single',
		}),
	],
	ssr: {
		noExternal: ['react-helmet-async'],
	},
}

export default config
