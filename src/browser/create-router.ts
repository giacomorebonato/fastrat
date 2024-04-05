import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { routeTree } from '#/route-tree.gen'

export function createRouter() {
	return createTanstackRouter({
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
