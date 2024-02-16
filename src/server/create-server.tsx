import Fs from 'node:fs'
import Path from 'node:path'
import { PassThrough } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-router-server/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import appRootPath from 'app-root-path'
import { type FastifyServerOptions, fastify } from 'fastify'
import { renderToPipeableStream } from 'react-dom/server'
import { googleAuth } from '#auth/google-auth'
import { createRouter } from '#browser/create-router'
import { apiRouter } from './api-router'
import { createPageHtml } from './create-page-html'
import { createTemplate } from './create-template'
import { env } from './env'
import { createContext } from './trpc-context'

const distClientPath = Path.join(appRootPath.path, 'dist/client')

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

	if (env.NODE_ENV === 'production') {
		const files = Fs.readdirSync(distClientPath).filter((file) => {
			return !Fs.statSync(Path.join(distClientPath, file)).isDirectory()
		})

		for (const url of files
			.map((file) => `/${file}`)
			.filter((file) => file !== 'index.html')) {
			server.get(url, (request, reply) => {
				const filename = request.url.slice(1)
				const filePath = Path.join(appRootPath.path, 'dist/client')

				reply.sendFile(filename, filePath)
			})
		}

		server.get('/app-shell', (request, reply) => {
			// this is for the service worker cache
			reply.type('text/html').send(createPageHtml(''))
		})
	}

	server.get('/robots.txt', (request, reply) => {
		reply
			.type('text/plain')
			.send(Fs.readFileSync(Path.join(appRootPath.path, 'robots.txt')))
	})

	server.get('/googleeaf3b21d2e7978d5.html', (request, reply) => {
		reply
			.type('text/plain')
			.send('google-site-verification: googleeaf3b21d2e7978d5.html')
	})

	server.get('*', async (request, reply) => {
		// helmetContext and redirect are passed to the rendering router
		// and mutated, so we can verify their data
		request.helmetContext = {}
		request.redirect = {}

		const router = createRouter()
		const memoryHistory = createMemoryHistory({
			initialEntries: [request.url],
		})
		router.update({
			history: memoryHistory,
			context: {
				...router.options.context,
				helmetContext: request.helmetContext,
				redirect: request.redirect,
			},
		})
		await router.load()

		// this is to populate helmetContext meta data for <head /> ahead of rendering
		await getDataFromTree(<StartServer router={router} />)

		if (request.redirect.to) {
			return reply.code(302).redirect(request.redirect.to)
		}

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { head, footer } = createTemplate(request.helmetContext!.helmet!)

		const pass = new PassThrough()

		pass.write(head)

		const pipeableStream = renderToPipeableStream(
			<StartServer router={router} />,
			{
				onShellReady() {
					pipeableStream.pipe(pass).write(footer)
				},
				onShellError(error) {
					reply.code(500)
					console.error(error)
				},
			},
		)

		reply.code(200).type('text/html').send(pass)

		return reply
	})

	await server.ready()

	return await server
}

export type FastRatServer = Awaited<ReturnType<typeof createServer>>
