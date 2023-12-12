import { type IncomingMessage, type ServerResponse } from 'node:http'
import { createServer } from '#features/server/create-server.js'
import { env } from '#features/server/env.js'
import type { FastifyInstance } from 'fastify'

declare global {
	// eslint-disable-next-line no-var
	var fastify: FastifyInstance
}

export default async function handler(
	request: IncomingMessage,
	reply: ServerResponse,
) {
	if (!globalThis.fastify) {
		globalThis.fastify = await createServer({
			env,
		})
	}

	globalThis.fastify!.server.emit('request', request, reply)
}
