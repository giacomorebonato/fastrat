import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const noteTable = sqliteTable('notes', {
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	creatorId: text('creator_id'),
	id: text('id').notNull().primaryKey(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export type NoteRecord = typeof noteTable.$inferSelect
export type NoteSelect = InferSelectModel<typeof noteTable>
export type NoteInsert = InferInsertModel<typeof noteTable>
export const insertNoteSchema = createInsertSchema(noteTable)
export const selectNoteSchema = createSelectSchema(noteTable)
