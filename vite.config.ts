import { vavite } from 'vavite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { type UserConfig } from 'vite'

const config: UserConfig = {
	buildSteps: [
		{ name: 'client' },
		{
			config: {
				build: { ssr: true, target: 'esnext' },
			},
			name: 'server',
		},
	],
	plugins: [
		vavite({
			reloadOn: 'static-deps-change',
			serverEntry: 'src/index.ts',
			serveClientAssetsInDev: true,
		}),
		react(),
		vike({
			disableAutoFullBuild: true,
			prerender: true,
		}),
	],
}

export default config
