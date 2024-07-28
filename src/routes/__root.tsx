import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import { createLink, trpcClient } from '#/browser/trpc-client'
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

const LazyPwaReloadPrompt = lazy(() => {
	return import('#/browser/pwa-reload-prompt')
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

					<Suspense fallback={null}>
						<LazyPwaReloadPrompt />
					</Suspense>
				</QueryClientProvider>
				<ScrollRestoration />
			</trpcClient.Provider>
		</HelmetProvider>
	)
}
