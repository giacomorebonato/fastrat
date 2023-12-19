import { Database } from '@hocuspocus/extension-database'
import { Server as HocuspocusServer } from '@hocuspocus/server'
import { eq } from 'drizzle-orm'
import { db } from '#features/db/db'
import { collaborationSchema } from './collaboration-schema'
import { FastifyInstance } from 'fastify'

export const collaborationPlugin = (
	server: FastifyInstance,
	_options: unknown,
	done: () => void,
) => {
	const hocuspocusServer = HocuspocusServer.configure({
		extensions: [
			new Database({
				fetch: async (data) => {
					const file = await db
						.select()
						.from(collaborationSchema)
						.where(eq(collaborationSchema.id, data.documentName))
						.get()

					return file?.content as Uint8Array
				},
				store: async (data) => {
					await db
						.update(collaborationSchema)
						.set({
							id: data.documentName,
							content: data.state,
						})
						.run()
				},
			}),
		],
	})

	server.get('/documents', { websocket: true }, (connection, request) => {
		hocuspocusServer.handleConnection(connection.socket, request.raw)
	})

	done()
}
