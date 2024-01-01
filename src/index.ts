import httpDevServer from 'vavite/http-dev-server'
import { createServer } from '#features/server/create-server'
import { env } from '#features/server/env.js'

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var server: Awaited<ReturnType<typeof createServer>>
}

globalThis.server = await createServer()

if (httpDevServer) {
	httpDevServer.on('request', (request, reply) => {
		server.server.emit('request', request, reply)
	})

	httpDevServer.on('upgrade', (request, socket, head) => {
		if (request?.url === '/trpc') {
			server.server.emit('upgrade', request, socket, head)
		}
	})

	httpDevServer.on('close', async () => {
		await server.close()
	})
} else {
	server.listen({
		host: env.HOST,
		port: env.PORT,
	})
}
