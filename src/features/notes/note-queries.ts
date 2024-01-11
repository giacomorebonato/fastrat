import { db } from '#features/db/db'
import { NoteRecord, noteSchema } from './note-schema'
import { eq } from 'drizzle-orm'

export const getNoteById = (
	noteId: string,
): Promise<NoteRecord | undefined> => {
	return db.select().from(noteSchema).where(eq(noteSchema.id, noteId)).get()
}
