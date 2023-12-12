import { vavite } from '@giacomorebonato/vavite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { type UserConfig } from 'vite'

const config: UserConfig = {
	plugins: [
		vavite({
			handlerEntry: 'src/index.ts',
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
