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

	httpDevServer.on('close', () => {
		server.server.emit('close')
	})

	httpDevServer.on('upgrade', (request, socket, head) => {
		if (request?.url === '/trpc') {
			server.server.emit('upgrade', request, socket, head)
		}
	})
} else {
	server.listen({
		host: env.HOST,
		port: env.PORT,
	})
}
