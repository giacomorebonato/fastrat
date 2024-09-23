import { integer, text } from 'drizzle-orm/sqlite-core'

export const BASIC_COLUMNS = {
	id: text('id').notNull().primaryKey(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => {
		return new Date()
	}),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
} as const
