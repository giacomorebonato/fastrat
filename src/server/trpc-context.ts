import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { z } from 'zod'
import { USER_TOKEN } from '#/auth/cookies'
import { parseToken } from '#/auth/create-token'
import type { FastratServer } from './create-server'
import { env } from './env'

const userValidator = z.object({
	email: z.string(),
	userId: z.string(),
})

export const createTrpcContext =
	(server: FastratServer) =>
	({ req, res }: CreateFastifyContextOptions) => {
		let user: z.infer<typeof userValidator> | null = null
		const userToken = req.cookies ? req.cookies[USER_TOKEN] : undefined

		if (userToken) {
			const unsigned =
				env.NODE_ENV === 'production' && !env.CI
					? req.unsignCookie(userToken)
					: {
							valid: true,
							value: userToken,
						}
			if (unsigned.valid && unsigned.value) {
				try {
					user = parseToken({
						secret: env.SECRET,
						token: unsigned.value,
						validator: userValidator,
					})
				} catch (error) {
					if (error instanceof Error) {
						req.log.warn(
							`Couldn't parse user token: ${error.message}.\nToken:${unsigned.value}`,
						)
					}
				}
			}
		}

		return {
			db: server.db,
			reply: res,
			request: req,
			user,
			queries: server.queries,
		}
	}
