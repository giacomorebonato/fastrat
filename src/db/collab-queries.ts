import Crypto from 'node:crypto'
import type { CollabSchema } from '#/db/collab-table'
import type { DbEvents, FastratDatabase } from '#/db/db-plugin'
import { collabTable } from '#/db/schema'

export class CollabQueries {
	constructor(
		private db: FastratDatabase,
		private dbEvents: DbEvents,
	) {}

	async upsert(collab: Pick<CollabSchema, 'content' | 'id'>) {
		const id = collab.id ?? Crypto.randomUUID()
		const entry = (await this.db
			.insert(collabTable)
			.values({
				...collab,
				id: id,
			})
			.onConflictDoUpdate({
				target: collabTable.id,
				set: {
					content: collab.content,
				},
			})
			.returning()
			.get()) as CollabSchema

		this.dbEvents.emit('UPSERT_COLLAB', entry)

		return entry
	}

	async byId(id: string) {
		return await this.db.query.collabTable.findFirst({
			where: (collab, { eq }) => {
				return eq(collab.id, id)
			},
		})
	}
}
