import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Server as HocusPocusServer } from '@hocuspocus/server'
import type { FastifyInstance } from 'fastify'
import { getUserFromRequest } from '#/auth/get-user-from-request'

type CollabContext = {
	user: Awaited<ReturnType<typeof getUserFromRequest>>
}

export const collabPlugin = (
	server: FastifyInstance,
	_options: unknown,
	done: () => void,
) => {
	const hocusPocusServer = HocusPocusServer.configure({
		onAuthenticate() {
			return Promise.resolve({})
		},
		extensions: [
			new Logger(),
			new Database({
				async fetch(data): Promise<Uint8Array | null> {
					const file = await server.queries.collab.byId(data.documentName)
					const content = (file?.content as Uint8Array) ?? null

					return content
				},
				async store(data): Promise<void> {
					await server.queries.collab.upsert({
						content: data.state,
						id: data.documentName,
					})
				},
			}),
		],
	})

	server.addHook('preValidation', async (request, reply) => {
		await getUserFromRequest({
			request,
			reply,
			queries: request.server.queries,
		})
	})

	server.get(
		'/collab/:docName',
		{ websocket: true },
		async (connection, request) => {
			const user = await getUserFromRequest({
				request,
				queries: request.server.queries,
			})
			const context: CollabContext = {
				user,
			}

			hocusPocusServer.handleConnection(connection, request.raw, context)
		},
	)

	done()
}
