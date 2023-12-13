import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const userSchema = sqliteTable('user', {
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	email: text('email'),
	id: text('id').notNull().primaryKey(),
	lastLoginAt: integer('updated_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const insertUserSchema = createInsertSchema(userSchema)
export const selectUserSchema = createSelectSchema(userSchema)
