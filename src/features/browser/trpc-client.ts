import {
	createTRPCReact,
	createWSClient,
	httpBatchLink,
	splitLink,
	wsLink,
} from '@trpc/react-query'
import type { ApiRouter } from '../server/api-router.js'

export const trpcClient = createTRPCReact<ApiRouter>()

export function createLink() {
	if (import.meta.env.SSR) {
		return httpBatchLink({ url: `${process.env.SITE_URL}/trpc` })
	}

	const wsUrl = `${import.meta.env.PROD ? 'wss' : 'ws'}://${
		window.location.host
	}/trpc`
	const httpUrl = `${import.meta.env.PROD ? 'https' : 'http'}://${
		window.location.host
	}/trpc`

	const wsClient = createWSClient({ url: wsUrl })

	return splitLink({
		condition(op) {
			return op.type === 'subscription'
		},
		true: wsLink<ApiRouter>({
			client: wsClient,
		}),
		false: httpBatchLink({ url: httpUrl }),
	})
}
