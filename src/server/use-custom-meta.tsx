import { Context } from '@tanstack/react-cross-context'
import { useRouter } from '@tanstack/react-router'
import jsesc from 'jsesc'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'

export function useCustomMeta() {
	const router = useRouter()

	const dehydratedCtx = useContext(
		Context.get('TanStackRouterHydrationContext', {}),
	)

	return `__TSR__.dehydrated = ${jsesc(
		router.options.transformer.stringify(dehydratedCtx),
		{
			isScriptContext: true,
			wrap: true,
			json: true,
		},
	)}`
}

export function CustomMeta() {
	const customMeta = useCustomMeta()

	return (
		<Helmet>
			{/* Do not remove or it'll break hydration */}
			<script>{customMeta}</script>
		</Helmet>
	)
}
