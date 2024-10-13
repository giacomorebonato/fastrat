import { blob, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BASIC_COLUMNS } from './basic-columns'

export const collabTable = sqliteTable('collab', {
	...BASIC_COLUMNS,
	content: blob('content').notNull(),
})

export type CollabSchema = Omit<typeof collabTable.$inferSelect, 'content'> & {
	content: Uint8Array | Buffer
}
export const insertCollabSchema = createInsertSchema(collabTable)
export const selectCollabSchema = createSelectSchema(collabTable)
