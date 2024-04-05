import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Socket } from 'node:net'
import { createServer } from '#/server/create-server'

const server = await createServer()

declare module 'node:net' {
	interface Socket {
		server: import('node:http').Server
	}
}

declare module 'node:http' {
	interface Server {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		vaviteUpgradeHandler?: any
	}
}

declare global {
	var ready: boolean
}

globalThis.ready = false

export default async function handler(
	request: IncomingMessage,
	reply: ServerResponse,
) {
	if (!ready) {
		await server.ready()

		const socketServer = request.socket.server
		if (socketServer.vaviteUpgradeHandler) {
			socketServer.off('upgrade', socketServer.vaviteUpgradeHandler)
		}

		socketServer.on('upgrade', handleUpgrade)
		socketServer.vaviteUpgradeHandler = handleUpgrade

		ready = true
	}

	server.server.emit('request', request, reply)
}

function handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer) {
	if (request.url === '/') {
		// Don't clash with vite's websocket server
		return
	}

	server.server.emit('upgrade', request, socket, head)
}
