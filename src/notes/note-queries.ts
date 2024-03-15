import { desc, eq } from 'drizzle-orm'
import { db } from '#db/db'
import { type NoteRecord, noteSchema } from './note-schema'

export const getNoteById = (
	noteId: string,
): Promise<NoteRecord | undefined> => {
	return db.select().from(noteSchema).where(eq(noteSchema.id, noteId)).get()
}

export const getNotes = () => {
	return db.select().from(noteSchema).orderBy(desc(noteSchema.createdAt))
}
