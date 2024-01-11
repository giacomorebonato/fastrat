import { vavite } from 'vavite'
import react from '@vitejs/plugin-react'
import { type UserConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

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
				},
			},
		},
	],
	plugins: [
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
