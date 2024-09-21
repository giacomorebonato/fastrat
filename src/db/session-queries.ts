import Crypto from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import type { FastratDatabase } from '#/db/db-plugin'
import { type SessionSchema, sessionTable } from '#/db/session-table'

export class SessionQueries {
	constructor(private db: FastratDatabase) {}
	upsert(session: Partial<SessionSchema> & Pick<SessionSchema, 'userId'>) {
		return this.db
			.insert(sessionTable)
			.values({
				// email: user.email.trim(),
				...session,
				id: session.id ?? Crypto.randomUUID(),
			})
			.returning()
			.get()
	}

	byId(refreshToken: string) {
		return this.db
			.select()
			.from(sessionTable)
			.where(eq(sessionTable.id, refreshToken))
			.get()
	}

	list() {
		return this.db
			.select()
			.from(sessionTable)
			.orderBy(desc(sessionTable.createdAt))
			.all()
	}
}
