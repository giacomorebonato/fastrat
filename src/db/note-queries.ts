import { desc, eq } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type NoteInsert, noteTable } from '#/db/note-table'

export class NoteQueries {
	constructor(private db: FastratDatabase) {}

	async delete(id: string) {
		return await this.db.delete(noteTable).where(eq(noteTable.id, id)).run()
	}

	async byId(noteId: string) {
		return await this.db
			.select()
			.from(noteTable)
			.where(eq(noteTable.id, noteId))
			.get()
	}

	async list() {
		return await this.db
			.select()
			.from(noteTable)
			.orderBy(desc(noteTable.createdAt))
			.all()
	}

	async upsert(note: NoteInsert) {
		return await this.db
			.insert(noteTable)
			.values(note)
			.returning()
			.onConflictDoUpdate({
				set: note,
				target: noteTable.id,
			})
			.get()
	}
}
