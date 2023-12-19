import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/react-query'
import React, { useState } from 'react'
import superjson from 'superjson'
import { trpcClient } from '#features/browser/trpc-client'
import { Layout } from './layout'
import type { PageContext } from './types'

export function PageShell({
	children,
}: {
	children: React.ReactNode
	pageContext: PageContext
}) {
	const [queryClient] = useState(() => new QueryClient())
	const [apiClient] = useState(() =>
		trpcClient.createClient({
			links: [
				httpBatchLink({
					url: '/trpc',
				}),
			],
			transformer: superjson,
		}),
	)

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
