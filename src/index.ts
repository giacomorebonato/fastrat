import httpDevServer from '@giacomorebonato/vavite/http-dev-server'
import { restartable } from '@fastify/restartable'
import { createServer } from '#features/server/create-server'
import { env } from '#features/server/env.js'

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var server: Awaited<ReturnType<typeof createServer>>
}

if (!globalThis.server) {
	globalThis.server = await restartable(createServer, {
		logger: true,
		maxParamLength: 5_000,
	})
} else {
	globalThis.server = await restartable(createServer, {
		logger: true,
		maxParamLength: 5_000,
	})
	// await globalThis.server.restart() // doesn't work with livereload
}

if (httpDevServer) {
	httpDevServer.on('request', (request, reply) => {
		server.server.emit('request', request, reply)
	})

	httpDevServer.on('close', async () => {
		await server.close()
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
