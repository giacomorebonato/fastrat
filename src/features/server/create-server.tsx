import through from 'through'
import { ReadableStream } from 'node:stream/web'
import Fs from 'node:fs'
import Path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-router-server/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import appRootPath from 'app-root-path'
import { type FastifyServerOptions, fastify } from 'fastify'
import ReactDOMServer, {
	renderToNodeStream,
	renderToPipeableStream,
	renderToReadableStream,
} from 'react-dom/server'
import { createRouter } from '#create-router'
import { googleAuth } from '#features/auth/google-auth'
import { apiRouter } from './api-router'
import { createPageHtml } from './create-page-html'
import { env } from './env'
import { createContext } from './trpc-context'
import { getDataFromTree } from 'react-apollo'
import { createTemplate } from './create-template'
import { PassThrough, Readable, Writable } from 'node:stream'

const getWorkboxFilename = () => {
	if (env.NODE_ENV !== 'production') {
		return null
	}

	const files = Fs.readdirSync(Path.join(appRootPath.path, 'dist/client'))
	const file = files.find((file) => file.startsWith('workbox'))

	return file
}

class HtmlWritable extends Writable {
	chunks = []
	html = ''

	getHtml() {
		return this.html
	}

	_write(chunk, encoding, callback) {
		this.chunks.push(chunk)
		callback()
	}

	_final(callback) {
		this.html = Buffer.concat(this.chunks).toString()
		callback()
	}
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
	].filter(Boolean)) {
		server.get(url, (request, reply) => {
			const filename = request.url.slice(1)
			const filePath = Path.join(appRootPath.path, 'dist/client')

			reply.sendFile(filename, filePath)
		})
	}

	// this is for the service worker cache
	server.get('/index.html', (request, reply) => {
		reply.type('text/html').send(createPageHtml(''))
	})

	server.get('/googleeaf3b21d2e7978d5.html', (request, reply) => {
		reply
			.type('text/plain')
			.send('google-site-verification: googleeaf3b21d2e7978d5.html')
	})

	server.get('*', async (request, reply) => {
		request.helmetContext = {}

		const router = createRouter()
		const memoryHistory = createMemoryHistory({
			initialEntries: [request.url],
		})
		router.update({
			history: memoryHistory,
			context: {
				...router.options.context,
				helmetContext: request.helmetContext,
			},
		})
		await router.load()

		await getDataFromTree(<StartServer router={router} />)

		const { head, footer } = createTemplate(request.helmetContext.helmet)

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
