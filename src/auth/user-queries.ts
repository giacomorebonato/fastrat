import Crypto from 'node:crypto'
import { db } from '#/db/db'
import { userTable } from '#/db/user-table'

export const upsertUser = async (user: { email: string }) => {
	const dbUsers = await db
		.insert(userTable)
		.values({
			email: user.email.trim(),
			id: Crypto.randomUUID(),
		})
		.onConflictDoUpdate({
			set: {
				updatedAt: new Date(),
			},
			target: userTable.email,
		})
		.returning({
			email: userTable.email,
			id: userTable.id,
		})
	const dbUser = dbUsers[0]

	return dbUser
}
