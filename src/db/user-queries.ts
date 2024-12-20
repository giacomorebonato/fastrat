import Crypto from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type UserSchema, userTable } from '#/db/user-table'
import { sessionTable } from './session-table'

export class UserQueries {
	constructor(private db: FastratDatabase) {}
	async upsert(user: Partial<UserSchema> & Pick<UserSchema, 'email'>) {
		return await this.db
			.insert(userTable)
			.values({
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
	}

	async bySessionId(sessionId: string) {
		return await this.db
			.select({
				user: userTable,
			})
			.from(userTable)
			.innerJoin(sessionTable, eq(userTable.id, sessionTable.userId))
			.where(eq(sessionTable.id, sessionId))
			.get()
			.then((entry) => {
				return entry?.user
			})
	}

	async list() {
		return await this.db
			.select()
			.from(userTable)
			.orderBy(desc(userTable.createdAt))
			.all()
	}
}
