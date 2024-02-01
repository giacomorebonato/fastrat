import Fs from 'node:fs'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import { HelmetServerState } from 'react-helmet-async'
import { env } from './env'

export const createTemplate = (helmet: HelmetServerState) => {
	const indexPath =
		env.NODE_ENV === 'production'
			? Path.join(appRootPath.path, 'dist/client/index.html')
			: Path.join(appRootPath.path, 'index.html')

	const code = Fs.readFileSync(indexPath, 'utf-8')
	let head = code.slice(0, code.indexOf('<!--app-head-->'))

	head += helmet.title.toString()
	head += helmet.meta.toString()
	if (env.NODE_ENV === 'development') {
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

	let footer = '</div>'
	footer += code.slice(code.indexOf('<script '))

	return { head, footer }
}
