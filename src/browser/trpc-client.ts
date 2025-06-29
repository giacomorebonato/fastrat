import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query'
import superjson from 'superjson'
import type { ApiRouter } from '#/server/api-router.js'

export const trpcClient = createTRPCReact<ApiRouter>()

const getProtocol = (
	type: 'http' | 'ws' = 'http',
): 'http' | 'https' | 'ws' | 'wss' => {
	if (import.meta.env.PROD && window?.location.protocol === 'https:') {
		return `${type}s`
	}

	return type
}

export function createLinks() {
	if (import.meta.env.SSR) {
		return [
			httpBatchLink({
				transformer: superjson,
				url: `${process.env.SITE_URL}/trpc`,
			}),
		]
	}

	const httpUrl = `${getProtocol('http')}://${window.location.host}/trpc`

	return [loggerLink(), httpBatchLink({ url: httpUrl, transformer: superjson })]
}
