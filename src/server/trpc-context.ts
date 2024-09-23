import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { z } from 'zod'
import * as CookieHelpers from '#/auth/cookie-helpers'
import * as TokenHelpers from '#/auth/token-helpers'
import type { FastratServer } from './create-server'
import { env } from './env'

const userValidator = z.object({
	email: z.string(),
	userId: z.string(),
})

export const createTrpcContext =
	(server: FastratServer) =>
	({ req: request, res: reply }: CreateFastifyContextOptions) => {
		const userToken = CookieHelpers.getUnsignedCookie({
			request,
			name: CookieHelpers.USER_TOKEN,
		})
		const refreshToken = CookieHelpers.getUnsignedCookie({
			request,
			name: CookieHelpers.REFRESH_TOKEN,
		})
		const context = {
			db: server.db,
			reply,
			request: request,
			user: null as z.infer<typeof userValidator> | null,
			queries: server.queries,
		}

		if (userToken?.value) {
			context.user = TokenHelpers.parseToken({
				token: userToken?.value,
				secret: env.SECRET,
				validator: userValidator,
			})
		}

		if (!context.user) {
			if (refreshToken?.value) {
				const session = server.queries.session.byId(refreshToken.value)
				const user = server.queries.user.bySessionId(refreshToken.value)

				if (session?.disabled !== false || !user) {
					CookieHelpers.clearAuthCookies(reply)
					return context
				}

				CookieHelpers.setAuthentication({
					server: request.server,
					reply: reply,
					user: {
						id: user.id,
						email: user.email,
					},
				})

				context.user = {
					email: user.email,
					userId: user.id,
				}
			}

			return context
		}

		return context
	}
