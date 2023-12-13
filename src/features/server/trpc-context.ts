import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { db } from '#features/db/db.js'

export function createContext({ req, res }: CreateFastifyContextOptions) {
	const user = req.cookies.user

	return { db, reply: res, request: req }
}
