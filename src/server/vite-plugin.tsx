import Fs from 'node:fs'
import Path from 'node:path'
import { PassThrough } from 'node:stream'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/start/server'
import appRootPath from 'app-root-path'
import { fastifyPlugin } from 'fastify-plugin'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { createRouter } from '#/browser/create-router'
import { createTemplate } from './create-template'

const distClientPath = import.meta.env.PROD
	? Path.join(appRootPath.path, 'dist/client')
	: Path.join(appRootPath.path, 'public')

export const vitePlugin = fastifyPlugin(async (fastify) => {
	if (import.meta.env.PROD) {
		await fastify.register(import('@fastify/static'), {
			prefix: '/assets/',
			root: Path.join(appRootPath.path, 'dist/client/assets'),
		})
	}

	const files = Fs.readdirSync(distClientPath).filter((file) => {
		return !Fs.statSync(Path.join(distClientPath, file)).isDirectory()
	})

	for (const url of files.map((file) => `/${file}`)) {
		fastify.get(url, (request, reply) => {
			const filename = request.url.slice(1)

			reply.sendFile(filename, distClientPath)
		})
	}

	fastify.get('*', async (request, reply) => {
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

		const passStream = new PassThrough()

		passStream.write(head)

		const callbackName = isbot(request.headers['user-agent'])
			? 'onAllReady'
			: 'onShellReady'

		let didError = false
		reply.type('text/html')
		// https://react.dev/reference/react-dom/server/renderToPipeableStream
		const pipeableStream = renderToPipeableStream(
			<StartServer router={router} />,
			{
				[callbackName]: () => {
					reply.code(didError ? 500 : 200)
					pipeableStream.pipe(passStream).write(footer)
				},
				onShellError(error) {
					console.error(error)

					return reply.code(500).send(`<h1>Something went wrong</h1>`)
				},
				onError(error) {
					didError = true
					console.error(error)
				},
			},
		)

		return reply.send(passStream)
	})
})

export default vitePlugin
