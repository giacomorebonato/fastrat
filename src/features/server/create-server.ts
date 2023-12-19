import { fileURLToPath } from 'node:url'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { renderPage } from 'vike/server'
import { googleAuth } from '#features/auth/google-auth'
import { apiRouter } from './api-router'
import { type Env } from './env'
import { createContext } from './trpc-context'
import { collaborationPlugin } from '#features/collaboration/collaboration-plugin'

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
		.register(import('@fastify/websocket'), {
			connectionOptions: {
				readableObjectMode: true,
			},
		})
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: options.env.SECRET,
		})

	// .register(googleAuth)
	// .register(fastifyTRPCPlugin, {
	// 	prefix: '/trpc',
	// 	trpcOptions: { createContext, router: apiRouter },
	// 	// useWSS: true,
	// })
	// .register(collaborationPlugin, {
	// 	prefix: '/collaboration',
	// })

	server.get(
		'/ws',
		{
			websocket: true,
		},
		(connection) => {
			connection.socket.on('message', (message) => {
				// message.toString() === 'hi from client'
				connection.socket.send('hi from server')
			})
		},
	)

	server.get('*', async (request, reply) => {
		const pageContext = await renderPage({ urlOriginal: request.url })
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
