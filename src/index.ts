import { type IncomingMessage, type ServerResponse } from 'node:http'
import type { FastifyInstance } from 'fastify'
import { createServer } from '#features/server/create-server.js'
import { env } from '#features/server/env.js'

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var fastify: FastifyInstance
}

export default async function handler(
	request: IncomingMessage,
	reply: ServerResponse,
) {
	;(
		globalThis.fastify ??
		(await createServer({
			env,
		}))
	).server.emit('request', request, reply)
}
