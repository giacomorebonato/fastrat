import { sql } from 'drizzle-orm'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const collaborationSchema = sqliteTable('collaboration', {
	content: blob('content'),
	createdAt: integer('created_at', {
		mode: 'timestamp',
	})
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	id: text('id').primaryKey(),
	published: integer('completed').default(0),
	title: text('title').notNull(),
	updatedAt: integer('updated_at', {
		mode: 'timestamp',
	})
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
})
