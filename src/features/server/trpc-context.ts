import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { db } from '#features/db/db.js'

export function createContext({ req, res }: CreateFastifyContextOptions) {
	const user = res.cookies.user

	console.log(user)

	return { db, reply: res, request: req }
}
