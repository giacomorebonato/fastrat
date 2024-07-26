import { createRouter as createReactRouter } from '@tanstack/react-router'

import { SuperJSON } from 'superjson'
import type { Queries } from '#/db/build-queries'
import { routeTree } from '#/route-tree.gen'

export function createRouter(
	params: {
		queries?: Queries
	} = {},
) {
	return createReactRouter({
		transformer: SuperJSON,
		routeTree,
		context: {
			queries: params.queries,
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
