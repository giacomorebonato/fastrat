import { eq } from 'drizzle-orm'
import { db } from '#features/db/db'
import { NoteRecord, noteSchema } from './note-schema'

export const getNoteById = (
	noteId: string,
): Promise<NoteRecord | undefined> => {
	return db.select().from(noteSchema).where(eq(noteSchema.id, noteId)).get()
}
