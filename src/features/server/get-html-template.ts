import Fs from 'node:fs'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import { env } from './env'

export const getHtmlTemplate = ({ appHtml }: { appHtml: string }) => {
	const indexPath =
		env.NODE_ENV === 'production'
			? Path.join(appRootPath.path, 'dist/client/index.html')
			: Path.join(appRootPath.path, 'index.html')

	let code = Fs.readFileSync(indexPath, 'utf-8')

	if (env.NODE_ENV === 'development') {
		code = code.replace(
			'<!--app-head-->',
			`<script type="module" src="/@vite/client"></script>
			<script type="module">
  import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
			</script>
		`,
		)
	}

	return code.replace('<!--app-html-->', appHtml)
}
