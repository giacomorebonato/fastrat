import type { FastifyInstance } from 'fastify'
import { createServer } from '#features/server/create-server'
import { env } from '#features/server/env.js'
import httpDevServer from '@giacomorebonato/vavite/http-dev-server'

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var fastify: FastifyInstance
}

const server = await createServer({
	env,
})

if (httpDevServer) {
	httpDevServer.on('request', (request, reply) => {
		server.server.emit('request', request, reply)
	})

	httpDevServer.on('upgrade', (request, socket, head) => {
		console.log({
			request,
		})
		if (['/collaboration/documents', '/trpc'].includes(request.url!)) {
			server.server.emit('upgrade', request, socket, head)
		}
	})
} else {
	console.log('Starting prod server')
	server.listen()
}
