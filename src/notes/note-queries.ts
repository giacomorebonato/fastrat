import { desc, eq } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type NoteInsert, noteTable } from '#/db/note-table'

export class NoteQueries {
	constructor(private db: FastratDatabase) {}

	delete(id: string) {
		return this.db.delete(noteTable).where(eq(noteTable.id, id)).run()
	}

	byId(noteId: string) {
		return this.db
			.select()
			.from(noteTable)
			.where(eq(noteTable.id, noteId))
			.get()
	}

	list() {
		return this.db
			.select()
			.from(noteTable)
			.orderBy(desc(noteTable.createdAt))
			.all()
	}

	upsert(note: NoteInsert) {
		return this.db
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
