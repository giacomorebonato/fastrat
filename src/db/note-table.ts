import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BASIC_COLUMNS } from './basic-columns'

export const noteTable = sqliteTable('notes', {
	...BASIC_COLUMNS,
	content: text('content').notNull(),
	creatorId: text('creator_id'),
})

export type NoteRecord = typeof noteTable.$inferSelect
export type NoteSelect = InferSelectModel<typeof noteTable>
export type NoteInsert = InferInsertModel<typeof noteTable>
export const insertNoteSchema = createInsertSchema(noteTable)
export const selectNoteSchema = createSelectSchema(noteTable)
