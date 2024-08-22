import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import { createLink, trpcClient } from '#/browser/trpc-client'
import { ClientOnly } from '#/server/client-only'
import { CustomMeta } from '#/server/use-custom-meta'
import type { RouterContext } from '#/types/router-context'

export const Route = createRootRouteWithContext<RouterContext>()({
	loader({ context }) {
		return { helmetContext: context?.helmetContext ?? {} }
	},
	component: RootComponent,
	notFoundComponent: () => {
		return <p>This setting page doesn't exist!</p>
	},
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
		<HelmetProvider context={loaderData?.helmetContext || {}}>
			<CustomMeta />
			<trpcClient.Provider client={apiClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Outlet />

					<ClientOnly load={() => import('#/browser/pwa-reload-prompt')}>
						{(LazyPwaReloadPrompt) => <LazyPwaReloadPrompt />}
					</ClientOnly>
				</QueryClientProvider>
				<ScrollRestoration />
			</trpcClient.Provider>
		</HelmetProvider>
	)
}
