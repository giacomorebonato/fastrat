import { HelmetServerState } from 'react-helmet-async'

export type RouterContext = {
	helmetContext: {
		helmet?: HelmetServerState
	}
}

declare module 'fastify' {
	interface FastifyRequest {
		helmetContext: {
			helmet?: HelmetServerState
		}
	}
}
