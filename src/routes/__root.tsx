import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { DehydrateRouter } from '@tanstack/react-router-server/client'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import { createLink, trpcClient } from '#/browser/trpc-client'
import type { RouterContext } from '#/types/router-context'

export const Route = createRootRouteWithContext<RouterContext>()({
	loader({ context }) {
		return { helmetContext: context.helmetContext }
	},
	component: RootComponent,
})

const queryClient = new QueryClient()
const apiClient = trpcClient.createClient({
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
					<Outlet />
				</QueryClientProvider>
				<DehydrateRouter />
			</trpcClient.Provider>
		</HelmetProvider>
	)
}
