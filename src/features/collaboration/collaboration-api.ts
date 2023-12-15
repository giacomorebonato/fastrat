import { Database } from '@hocuspocus/extension-database'
import { Server as HocusPocusServer } from '@hocuspocus/server'
import { TRPCError } from '@trpc/server'
import { noteSchema } from '#features/db/schema'
import { publicProcedure, router } from '#features/server/trpc-server'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { insertNoteSchema } from './note-schema'

export const noteApi = (
	app: FastifyInstance,
	_options: any,
	done: () => void,
) => {
	const hocusPocusServer = HocusPocusServer.configure({
		extensions: [
			new Database({
				fetch: async (data) => {
					const file = await db
						.select()
						.from(files)
						.where(eq(files.id, data.documentName))
						.get()

					return file?.content as any
				},
				store: async (data) => {
					await db
						.update(files)
						.set({
							id: data.documentName,
							content: data.state,
						})
						.run()
				},
			}),
		],
	})

	app.get('/editor/:docName', { websocket: true }, (connection, request) => {
		hocusPocusServer.handleConnection(connection.socket, request.raw)
	})

	done()
}
