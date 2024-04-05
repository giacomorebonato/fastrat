import { desc, eq } from 'drizzle-orm'
import { db } from '#/db/db'
import { type NoteRecord, noteTable } from '#/db/note-table'

export const getNoteById = (
	noteId: string,
): Promise<NoteRecord | undefined> => {
	return db.select().from(noteTable).where(eq(noteTable.id, noteId)).get()
}

export const getNotes = () => {
	return db.select().from(noteTable).orderBy(desc(noteTable.createdAt))
}
