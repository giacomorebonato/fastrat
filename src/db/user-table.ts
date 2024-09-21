import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { BASIC_COLUMNS } from './basic-columns'

export const userTable = sqliteTable('user', {
	...BASIC_COLUMNS,
	email: text('email').unique().notNull(),
	lastLoginAt: integer('updated_at', { mode: 'timestamp' }),
	nickname: text('nickname'),
})

export type UserSchema = typeof userTable.$inferSelect
export const insertUserSchema = createInsertSchema(userTable)
export const selectUserSchema = createSelectSchema(userTable)
