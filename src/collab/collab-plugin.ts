import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Server as HocusPocusServer } from '@hocuspocus/server'
import type { FastifyInstance } from 'fastify'
import { getUserFromRequest } from '#/auth/get-user-from-request'

type CollabContext = {
	user: ReturnType<typeof getUserFromRequest>
}

export const collabPlugin = (
	server: FastifyInstance,
	_options: unknown,
	done: () => void,
) => {
	const hocusPocusServer = HocusPocusServer.configure({
		extensions: [
			new Logger(),
			new Database({
				async fetch(data): Promise<Uint8Array | null> {
					const file = server.queries.collab.byId(data.documentName)
					// const context = data.context as CollabContext
					// context.user

					return (file?.content as Uint8Array) ?? null
				},
				async store(data): Promise<void> {
					// const context = data.context as CollabContext
					// context.user

					server.queries.collab.upsert({
						content: data.state,
						id: data.documentName,
					})
				},
			}),
		],
	})

	server.addHook('preValidation', async (request, reply) => {
		getUserFromRequest({
			request,
			reply,
			server,
		})
	})

	server.get('/collab/:docName', { websocket: true }, (connection, request) => {
		const user = getUserFromRequest({
			request,
			server,
		})
		const context: CollabContext = {
			user,
		}
		hocusPocusServer.handleConnection(connection, request.raw, context)
	})

	done()
}
