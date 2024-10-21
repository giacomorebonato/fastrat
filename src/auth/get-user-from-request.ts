import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as CookieHelpers from '#/auth/cookie-helpers'
import * as TokenHelpers from '#/auth/token-helpers'
import type { FastratServer } from '#/server/create-server'
import { env } from '#/server/env'

const userValidator = z.object({
	email: z.string(),
	userId: z.string(),
})
type MaybeUser = z.infer<typeof userValidator> | null

export function getUserFromRequest({
	request,
	reply,
	server,
}: {
	request: FastifyRequest
	reply?: FastifyReply
	server: FastratServer
}): {
	user: MaybeUser
} {
	const userToken = CookieHelpers.getUnsignedCookie({
		request,
		name: CookieHelpers.USER_TOKEN,
	})
	const refreshToken = CookieHelpers.getUnsignedCookie({
		request,
		name: CookieHelpers.REFRESH_TOKEN,
	})
	let user: MaybeUser = null

	if (userToken?.value) {
		user = TokenHelpers.parseToken({
			token: userToken?.value,
			secret: env.SECRET,
			validator: userValidator,
		})
	}

	// we try to update the cookie only if reply is present
	if (reply && !user && refreshToken?.value) {
		const session = server.queries.session.byId(refreshToken.value)
		const dbUser = server.queries.user.bySessionId(refreshToken.value)

		if (session?.disabled !== false || !dbUser) {
			CookieHelpers.clearAuthCookies(reply)
		} else {
			CookieHelpers.setAuthentication({
				server: request.server,
				reply: reply,
				user: {
					id: dbUser.id,
					email: dbUser.email,
				},
			})

			user = {
				email: dbUser.email,
				userId: dbUser.id,
			}
		}
	}

	return { user }
}
