import Fs from 'node:fs'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import type { HelmetServerState } from 'react-helmet-async'
import { env } from './env'

export const createTemplate = <const T extends HelmetServerState>(
	helmet: T | null = null,
	nodeEnv = env.NODE_ENV,
) => {
	const indexPath =
		nodeEnv === 'production'
			? Path.join(appRootPath.path, 'dist/client/index.html')
			: Path.join(appRootPath.path, 'index.html')

	const code = Fs.readFileSync(indexPath, 'utf-8')
	let head = code.slice(0, code.indexOf('</head>'))

	for (const htmlElement of Object.values(helmet || {})) {
		if (typeof htmlElement.toString === 'function') {
			head += htmlElement.toString()
		}
	}

	if (nodeEnv === 'development') {
		head += `<script type="module" src="/@vite/client"></script>
		<script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
		</script>`
	}
	head += '</head><body><div id="root">'

	const footer = code.slice(
		code.indexOf(`<!--app-html-->`) + `<!--app-html-->`.length,
	)

	return { head, footer }
}
