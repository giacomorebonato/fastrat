import type { HelmetServerState } from 'react-helmet-async'

export type RouterContext = {
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
