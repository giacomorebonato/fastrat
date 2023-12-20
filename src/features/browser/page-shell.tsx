import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createWSClient, httpBatchLink, splitLink } from '@trpc/react-query'
import React, { useState } from 'react'
import superjson from 'superjson'
import { trpcClient } from '#features/browser/trpc-client'
import { Layout } from './layout'
import type { PageContext } from './types'
import { TRPCClientRuntime, wsLink } from '@trpc/client'
import { ApiRouter } from '#features/server/api-router'
import { env } from '#features/server/env'

function createLink(_trpcClientRuntime?: TRPCClientRuntime) {
	if (typeof window === 'undefined') {
		return httpBatchLink({ url: 'http://localhost:3000/trpc' })
	}

	const wsClient = createWSClient({ url: 'ws://localhost:3000/trpc' })

	return splitLink({
		condition(op) {
			return op.type === 'subscription'
		},
		true: wsLink<ApiRouter>({
			client: wsClient,
		}),
		false: httpBatchLink({ url: 'http://localhost:3000/trpc' }),
	})
}

export function PageShell({
	children,
}: {
	children: React.ReactNode
	pageContext: PageContext
}) {
	const [queryClient] = useState(() => new QueryClient())

	const [apiClient] = useState(() => {
		return trpcClient.createClient({
			transformer: superjson,

			links: [createLink()],
		})
	})

	return (
		<React.StrictMode>
			<trpcClient.Provider client={apiClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Layout>{children}</Layout>
					<ReactQueryDevtools buttonPosition='bottom-right' />
				</QueryClientProvider>
			</trpcClient.Provider>
		</React.StrictMode>
	)
}
