import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, rootRouteWithContext } from '@tanstack/react-router'
import { DehydrateRouter } from '@tanstack/react-router-server/client'
import superjson from 'superjson'
import { Layout } from '#features/browser/layout'
import { createLink, trpcClient } from '#features/browser/trpc-client'
import { type RouterContext } from '../router-context'

export const Route = rootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

const intervalMS = 60 * 60 * 1000

const queryClient = new QueryClient()
const apiClient = trpcClient.createClient({
	transformer: superjson,

	links: [createLink()],
})

function RootComponent() {
	return (
		<trpcClient.Provider client={apiClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<Layout>
					<Outlet />
				</Layout>
			</QueryClientProvider>
			<DehydrateRouter />
		</trpcClient.Provider>
	)
}
