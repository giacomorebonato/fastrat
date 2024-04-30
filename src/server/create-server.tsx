import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { type FastifyServerOptions, fastify } from 'fastify'
import { googleAuth } from '#/auth/google-auth'
import { apiRouter } from './api-router'
import { env } from './env'
import { createContext } from './trpc-context'

export async function createServer(
	options: FastifyServerOptions = {
		logger: true,
		maxParamLength: 5_000,
	},
) {
	const server = fastify(options)

	await server
		.register(import('./redirect-plugin'), {
			hostNamesRedirectFrom: env.HOST_NAMES_REDIRECT_FROM,
			hostNameRedirectTo: env.SITE_URL,
		})
		.register(import('./vite-plugin'))
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: env.SECRET,
		})
		.register(import('@fastify/websocket'))
		.register(googleAuth, {
			GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
		})
		.register(fastifyTRPCPlugin, {
			prefix: '/trpc',
			trpcOptions: { createContext, router: apiRouter },
			useWSS: true,
		})
		.ready()

	return await server
}

export type FastRatServer = Awaited<ReturnType<typeof createServer>>
