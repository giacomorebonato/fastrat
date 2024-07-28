import type { HelmetServerState } from 'react-helmet-async'
import type { Queries } from '#/db/build-queries'

export type RouterContext = {
	queries?: Queries
	helmetContext: {
		helmet?: HelmetServerState
	}
	redirect: {
		to?: string
	}
}

declare module 'fastify' {
	interface FastifyRequest {
		helmetContext: {
			helmet?: HelmetServerState
		}
		redirect: {
			to?: string
		}
	}
}
