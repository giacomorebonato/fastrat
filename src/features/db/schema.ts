import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export { noteSchema } from '#features/notes/note-schema'

export const users = sqliteTable('users', {
	id: text('id').notNull().primaryKey(),
})

export const userSessions = sqliteTable('user_sessions', {
	id: text('id').notNull().primaryKey(),
})

export const userKeys = sqliteTable('user_keys', {
	hashedPassword: text('hashed_password'),
	id: text('id').notNull().primaryKey(),
	userId: text('user_id').notNull(),
})
