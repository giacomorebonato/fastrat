import Fs from 'node:fs'
import Path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-router-server/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import appRootPath from 'app-root-path'
import { type FastifyServerOptions, fastify } from 'fastify'
import ReactDOMServer from 'react-dom/server'
import { createRouter } from '#create-router'
import { googleAuth } from '#features/auth/google-auth'
import { apiRouter } from './api-router'
import { createPageHtml } from './create-page-html'
import { env } from './env'
import { createContext } from './trpc-context'

const getWorkboxFilename = () => {
	const files = Fs.readdirSync(Path.join(appRootPath.path, 'dist/client'))
	const file = files.find((file) => file.startsWith('workbox'))

	return file
}

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

	for (const url of [
		'/manifest.webmanifest',
		'/sw.js',
		'/registerSW.js',
		`/${getWorkboxFilename()}`,
	]) {
		server.get(url, (request, reply) => {
			const filename = request.url.slice(1)
			const filePath = Path.join(appRootPath.path, 'dist/client')

			reply.sendFile(filename, filePath)
		})
	}

	server.get('*', async (request, reply) => {
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

		void reply.code(200).type('text/html').send(createPageHtml(appHtml))
	})

	await server.ready()

	return await server
}

export type FastRatServer = Awaited<ReturnType<typeof createServer>>
