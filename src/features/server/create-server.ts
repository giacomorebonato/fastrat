import { fileURLToPath } from 'node:url'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { renderPage } from 'vike/server'
import { googleAuth } from '#features/auth/google-auth'
import { apiRouter } from './api-router'
import { env, type Env } from './env'
import { createContext } from './trpc-context'

export async function createServer(options: { env: Env }) {
	const server = fastify({
		logger: true,
		maxParamLength: 5_000,
	})

	if (options.env.NODE_ENV === 'production') {
		await server.register(import('@fastify/static'), {
			prefix: '/assets/',
			root: fileURLToPath(new URL('../client/assets', import.meta.url)),
		})
	}

	await server
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: options.env.SECRET,
		})
		.register(import('@fastify/websocket'), {
			connectionOptions: {
				readableObjectMode: true,
			},
		})
		.register(googleAuth)
		.register(fastifyTRPCPlugin, {
			prefix: '/trpc',
			trpcOptions: { createContext, router: apiRouter },
			useWSS: true,
		})

	server.get('*', async (request, reply) => {
		const pageContext = await renderPage({
			urlOriginal: request.url,
			siteUrl: env.SITE_URL,
		})
		const { httpResponse } = pageContext

		if (!httpResponse) {
			return 'no response'
		}

		const { body, headers, statusCode } = httpResponse

		for (const [key, value] of headers) {
			void reply.header(key, value)
		}

		void reply.code(statusCode).send(body)
	})

	await server.ready()

	return await server
}
