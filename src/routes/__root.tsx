import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, rootRouteWithContext } from '@tanstack/react-router'
import { DehydrateRouter } from '@tanstack/react-router-server/client'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import superjson from 'superjson'
import { Layout } from '#features/browser/layout'
import { createLink, trpcClient } from '#features/browser/trpc-client'
import { type RouterContext } from '../router-context'

export const Route = rootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

const queryClient = new QueryClient()
const apiClient = trpcClient.createClient({
	transformer: superjson,

	links: [createLink()],
})

function RootComponent() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Vite App</title>
				<script
					type='module'
					suppressHydrationWarning
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            `,
					}}
				/>
				<script type='module' src='/@vite/client' />
				<script type='module' src='/src/entry-client.tsx' />
			</head>
			<body>
				<trpcClient.Provider client={apiClient} queryClient={queryClient}>
					<QueryClientProvider client={queryClient}>
						<Layout>
							<Outlet />
						</Layout>
						<ReactQueryDevtools buttonPosition='bottom-left' />
					</QueryClientProvider>
				</trpcClient.Provider>
				<TanStackRouterDevtools position='bottom-right' />
				<DehydrateRouter />
			</body>
		</html>
	)
}
