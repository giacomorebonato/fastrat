import { vavite } from 'vavite'
import react from '@vitejs/plugin-react'
import { type UserConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
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
				define: {
					VITE_SSR: JSON.stringify(true),
					SSR: JSON.stringify(true),
				},
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
		VitePWA(),
		vavite({
			reloadOn: 'static-deps-change',
			serverEntry: 'src/index.ts',
			handlerEntry: 'src/handler.ts',
			serveClientAssetsInDev: true,
		}),
		react(),
		TanStackRouterVite(),
	],
}

export default config
