import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const userTable = sqliteTable('user', {
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	email: text('email').unique(),
	id: text('id').notNull().primaryKey(),
	lastLoginAt: integer('updated_at', { mode: 'timestamp' }),
	nickname: text('nickname'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export type UserSchema = typeof userTable.$inferSelect
export const insertUserSchema = createInsertSchema(userTable)
export const selectUserSchema = createSelectSchema(userTable)
