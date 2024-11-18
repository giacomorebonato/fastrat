import Crypto from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type SessionSchema, sessionTable } from '#/db/session-table'

export class SessionQueries {
	constructor(private db: FastratDatabase) {}
	async upsert(
		session: Partial<SessionSchema> & Pick<SessionSchema, 'userId'>,
	) {
		return await this.db
			.insert(sessionTable)
			.values({
				// email: user.email.trim(),
				...session,
				id: session.id ?? Crypto.randomUUID(),
			})
			.returning()
			.get()
	}

	async byId(refreshToken: string) {
		return await this.db
			.select()
			.from(sessionTable)
			.where(eq(sessionTable.id, refreshToken))
			.get()
	}

	async list() {
		return await this.db
			.select()
			.from(sessionTable)
			.orderBy(desc(sessionTable.createdAt))
			.all()
	}
}
