import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { USER_TOKEN } from '#features/auth/cookies'
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

	if (req.cookies[USER_TOKEN]) {
		try {
			user = parseToken({
				secret: env.SECRET,
				token: req.cookies.userToken,
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
