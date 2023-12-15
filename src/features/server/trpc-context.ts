import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { parseToken } from '#features/auth/create-token'
import { db } from '#features/db/db.js'
import { z } from 'zod'
import { env } from './env'

const userValidator = z.object({
	email: z.string(),
	userId: z.string(),
})

export function createContext({ req, res }: CreateFastifyContextOptions) {
	let user: z.infer<typeof userValidator> | undefined

	if (req.cookies.user) {
		try {
			user = parseToken({
				secret: env.SECRET,
				token: req.cookies.user,
				validator: userValidator,
			})
		} catch (error) {
			if (error instanceof Error) {
				req.log.warn(`Couldn't parse user token: ${error.message}`)
			}
		}
	}

	return { db, reply: res, request: req, user }
}
