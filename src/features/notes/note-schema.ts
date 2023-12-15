import { userSchema } from '#features/auth/user-schema'
import { collaborationSchema } from '#features/collaboration/collaboration-schema'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const noteSchema = sqliteTable('notes', {
	collaborationId: text('collaboration_id'),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	creatorId: text('creator_id'),
	id: text('id').notNull().primaryKey(),
	title: text('title'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const insertNoteSchema = createInsertSchema(noteSchema)
export const selectNoteSchema = createSelectSchema(noteSchema)

export const noteRelations = relations(noteSchema, ({ one }) => ({
	collaboration: one(collaborationSchema, {
		fields: [noteSchema.collaborationId],
		references: [collaborationSchema.id],
		relationName: 'collaboration',
	}),
	creator: one(userSchema, {
		fields: [noteSchema.creatorId],
		references: [userSchema.id],
		relationName: 'creator',
	}),
}))
