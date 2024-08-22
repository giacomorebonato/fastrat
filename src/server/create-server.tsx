import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { type FastifyServerOptions, fastify } from 'fastify'
import { googleAuth } from '#/auth/google-auth'
import { apiRouter } from './api-router'
import type { Env } from './env'
import { createTrpcContext } from './trpc-context'

export async function createServer(
	fastifyOptions: FastifyServerOptions = {
		logger: true,
		maxParamLength: 5_000,
	},
	options: {
		env?: Env
		skipVite: boolean
	} = {
		skipVite: false,
	},
) {
	if (!options.env) {
		throw Error(`Specify an env file`)
	}

	const server = fastify(fastifyOptions)

	await server
		.register(import('#/db/db-plugin'), {
			dbUrl: options.env.DATABASE_URL,
		})
		.register(import('./redirect-plugin'), {
			hostNamesRedirectFrom: options.env.HOST_NAMES_REDIRECT_FROM,
			hostNameRedirectTo: options.env.SITE_URL,
		})

	if (!options.skipVite) {
		await server.register(import('./vite-plugin'), {
			nodeEnv: options.env.NODE_ENV,
		})
	}

	server
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: options.env.SECRET,
		})
		.register(import('@fastify/websocket'))
		.register(googleAuth, {
			GOOGLE_CLIENT_ID: options.env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: options.env.GOOGLE_CLIENT_SECRET,
		})
		.register(fastifyTRPCPlugin, {
			prefix: '/trpc',
			trpcOptions: {
				createContext: createTrpcContext(server),
				router: apiRouter,
			},
			useWSS: true,
		})
		.ready()

	return await server
}

export type FastratServer = Awaited<ReturnType<typeof createServer>>
