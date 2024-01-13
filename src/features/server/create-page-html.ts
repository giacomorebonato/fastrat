import Fs from 'node:fs'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import { env } from './env'
import { extractCustomHead } from './extract-custom-head'

export const createPageHtml = (appHtml: string) => {
	const indexPath =
		env.NODE_ENV === 'production'
			? Path.join(appRootPath.path, 'dist/client/index.html')
			: Path.join(appRootPath.path, 'index.html')

	let code = Fs.readFileSync(indexPath, 'utf-8')

	let customHead = ''
	customHead += extractCustomHead(appHtml)

	if (env.NODE_ENV === 'development') {
		customHead += `<script type="module" src="/@vite/client"></script>
		<script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
		</script>`
	}

	code = code
		.replace('<!--app-head-->', customHead)
		.replace('<!--app-html-->', appHtml)

	return code
}
