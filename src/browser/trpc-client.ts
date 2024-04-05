import {
	createTRPCReact,
	createWSClient,
	httpBatchLink,
	splitLink,
	wsLink,
} from '@trpc/react-query'
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

export function createLink() {
	if (import.meta.env.SSR) {
		return httpBatchLink({
			transformer: superjson,
			url: `${process.env.SITE_URL}/trpc`,
		})
	}

	const wsUrl = `${getProtocol('ws')}://${window.location.host}/trpc`
	const httpUrl = `${getProtocol('http')}://${window.location.host}/trpc`

	const wsClient = createWSClient({ url: wsUrl })

	return splitLink({
		condition(op) {
			return op.type === 'subscription'
		},
		true: wsLink<ApiRouter>({
			client: wsClient,
			transformer: superjson,
		}),
		false: httpBatchLink({ url: httpUrl, transformer: superjson }),
	})
}
