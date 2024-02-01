import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, rootRouteWithContext } from '@tanstack/react-router'
import { DehydrateRouter } from '@tanstack/react-router-server/client'
import { HelmetProvider } from 'react-helmet-async'
import { HelmetServerState } from 'react-helmet-async'
import superjson from 'superjson'
import { Layout } from '#features/browser/layout'
import { createLink, trpcClient } from '#features/browser/trpc-client'
import { type RouterContext } from '../router-context'

export const Route = rootRouteWithContext<RouterContext>()({
	loader({ context }) {
		return { helmetContext: context.helmetContext }
	},
	component: RootComponent,
})

const queryClient = new QueryClient()
const apiClient = trpcClient.createClient({
	transformer: superjson,

	links: [createLink()],
})

function RootComponent() {
	const loaderData = Route.useLoaderData<{
		helmetContext: { helmet: HelmetServerState }
	}>()

	return (
		<HelmetProvider context={loaderData.helmetContext}>
			<trpcClient.Provider client={apiClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Layout>
						<Outlet />
					</Layout>
				</QueryClientProvider>
				<DehydrateRouter />
			</trpcClient.Provider>
		</HelmetProvider>
	)
}
