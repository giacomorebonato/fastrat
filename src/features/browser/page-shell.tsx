import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { wsLink } from '@trpc/client'
import { createWSClient, httpBatchLink, splitLink } from '@trpc/react-query'
import React, { useState } from 'react'
import superjson from 'superjson'
// import { env } from '#features/server/env'
import { usePageContext } from 'vike-react/usePageContext'
import { z } from 'zod'
import { trpcClient } from '#features/browser/trpc-client'
import { ApiRouter } from '#features/server/api-router'
import { Layout } from './layout'

function createLink(siteUrl: string) {
	if (typeof window === 'undefined') {
		return httpBatchLink({ url: `${siteUrl}/trpc` })
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

const pagePropsSchema = z.object({
	siteUrl: z.string(),
})

export function PageShell({
	children,
}: {
	children: React.ReactNode
}) {
	const pageContext = usePageContext()
	const [queryClient] = useState(() => new QueryClient())
	const [apiClient] = useState(() => {
		const pageProps = pagePropsSchema.parse(pageContext)
		return trpcClient.createClient({
			transformer: superjson,

			links: [createLink(pageProps.siteUrl)],
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
