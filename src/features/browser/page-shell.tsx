import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import React from 'react'
import superjson from 'superjson'
import { createLink, trpcClient } from '#features/browser/trpc-client'
import { Layout } from './layout'
import { useConstant } from './use-constant'

export function PageShell({
	children,
}: {
	children: React.ReactNode
}) {
	const queryClient = useConstant(() => new QueryClient())
	const apiClient = useConstant(() => {
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
