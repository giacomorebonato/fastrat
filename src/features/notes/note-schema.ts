import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const noteSchema = sqliteTable('notes', {
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	creatorId: text('creator_id'),
	id: text('id').notNull().primaryKey(),
	title: text('title'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export type NoteSelect = InferSelectModel<typeof noteSchema>
export type NoteInsert = InferInsertModel<typeof noteSchema>
export const insertNoteSchema = createInsertSchema(noteSchema)
export const selectNoteSchema = createSelectSchema(noteSchema)
