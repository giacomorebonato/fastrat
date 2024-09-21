import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BASIC_COLUMNS } from './basic-columns'
import { userTable } from './user-table'

export const sessionTable = sqliteTable('session', {
	...BASIC_COLUMNS,
	userAgent: text('user_agent'),
	userId: text('user_id')
		.references(() => userTable.id)
		.notNull(),
	disabled: integer('disabled', { mode: 'boolean' }),
})

export type SessionSchema = typeof sessionTable.$inferSelect
export const insertSessionSchema = createInsertSchema(sessionTable)
export const selectSessionSchema = createSelectSchema(sessionTable)
