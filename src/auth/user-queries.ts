import Crypto from 'node:crypto'
import { desc } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type UserSchema, userTable } from '#/db/user-table'

export class UserQueries {
	constructor(private db: FastratDatabase) {}
	upsert(user: Partial<UserSchema>) {
		const dbUser = this.db
			.insert(userTable)
			.values({
				// email: user.email.trim(),
				...user,
				id: user.id ?? Crypto.randomUUID(),
			})
			.onConflictDoUpdate({
				set: {
					updatedAt: new Date(),
				},
				target: userTable.email,
			})
			.returning({
				email: userTable.email,
				nickname: userTable.nickname,
				id: userTable.id,
			})
			.get()

		return dbUser
	}

	list() {
		return this.db
			.select()
			.from(userTable)
			.orderBy(desc(userTable.createdAt))
			.all()
	}
}
