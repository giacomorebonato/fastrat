import { Context } from '@tanstack/react-cross-context'
import { useRouter } from '@tanstack/react-router'
import jsesc from 'jsesc'
import { useContext } from 'react'

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
