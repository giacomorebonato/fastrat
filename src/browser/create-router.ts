import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { SuperJSON } from 'superjson'
import { routeTree } from '#/route-tree.gen'

export function createRouter() {
	return createTanstackRouter({
		transformer: SuperJSON,
		routeTree,
		context: {
			helmetContext: {},
			redirect: {},
		},
		defaultPreload: 'intent',
	})
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
