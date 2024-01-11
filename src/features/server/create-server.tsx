import Fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-router-server/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { type FastifyServerOptions, fastify } from 'fastify'
import ReactDOMServer from 'react-dom/server'
import { googleAuth } from '#features/auth/google-auth'
import { createRouter } from '#create-router'
import { apiRouter } from './api-router'
import { env } from './env'
import { createContext } from './trpc-context'
// import viteDevServer from 'vavite/vite-dev-server'
import { getHtmlTemplate } from './get-html-template'

export async function createServer(
	options: FastifyServerOptions = {
		logger: true,
		maxParamLength: 5_000,
	},
) {
	const server = fastify(options)

	if (env.NODE_ENV === 'production') {
		await server.register(import('@fastify/static'), {
			prefix: '/assets/',
			root: fileURLToPath(new URL('../client/assets', import.meta.url)),
		})
	}

	await server
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: env.SECRET,
		})
		.register(import('@fastify/websocket'), {
			connectionOptions: {
				readableObjectMode: true,
			},
		})

	await server.register(googleAuth, {
		GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
	})

	await server.register(fastifyTRPCPlugin, {
		prefix: '/trpc',
		trpcOptions: { createContext, router: apiRouter },
		useWSS: true,
	})

	server.get('*', async (request, reply) => {
		// if (viteDevServer) {
		// } else {
		// }

		const router = createRouter()
		const memoryHistory = createMemoryHistory({
			initialEntries: [request.url],
		})
		router.update({
			history: memoryHistory,
			context: {
				...router.options.context,
			},
		})
		await router.load()

		const appHtml = ReactDOMServer.renderToString(
			<StartServer router={router} />,
		)

		void reply.code(200).type('text/html').send(getHtmlTemplate({ appHtml }))
	})

	await server.ready()

	return await server
}

export type FastRatServer = Awaited<ReturnType<typeof createServer>>
