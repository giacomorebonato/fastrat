import type { UnsignResult } from '@fastify/cookie'
import { addDays, addMinutes } from 'date-fns'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastratServer } from '#/server/create-server'
import { env } from '#/server/env'
import { createToken } from './token-helpers'

const isProduction = env.NODE_ENV === 'production'

export const USER_TOKEN =
	env.NODE_ENV === 'production' && !env.CI ? '__Host-userToken' : 'userToken'

export const REFRESH_TOKEN =
	env.NODE_ENV === 'production' && !env.CI
		? '__Host-refreshToken'
		: 'refreshToken'

export const BASIC_COOKIE_PROPS = {
	httpOnly: true,
	path: '/',
	secure: isProduction && !env.CI,
	signed: isProduction && !env.CI,
} as const

export function getUnsignedCookie(params: {
	request: FastifyRequest
	name: string
}): UnsignResult | null {
	if (!params.request.cookies) {
		return null
	}
	const signedCookie = params.request.cookies[params.name]

	if (!signedCookie) {
		return null
	}

	if (params.request.protocol === 'http') {
		return { value: signedCookie, renew: false, valid: true }
	}

	const unsigned = params.request.unsignCookie(signedCookie)

	return unsigned
}

export function clearAuthCookies(reply: FastifyReply) {
	reply
		.clearCookie(USER_TOKEN, {
			...BASIC_COOKIE_PROPS,
		})
		.clearCookie(REFRESH_TOKEN, {
			...BASIC_COOKIE_PROPS,
		})
}

export function setAuthentication({
	server,
	reply,
	user,
}: {
	server: FastratServer
	reply: FastifyReply
	user: {
		id: string
		email: string
	}
}) {
	const dbUser = server.queries.user.upsert({
		email: user.email,
	})
	const token = createToken(
		{
			email: dbUser.email,
			userId: dbUser.id,
		},
		{ secret: env.SECRET, expiresIn: '10m' },
	)
	const inSevenDays = addDays(new Date(), 7)
	const inTenMinutes = addMinutes(new Date(), 10)

	if (reply) {
		reply
			.setCookie(USER_TOKEN, token, {
				...BASIC_COOKIE_PROPS,
				expires: inTenMinutes,
			})
			.setCookie(REFRESH_TOKEN, token, {
				...BASIC_COOKIE_PROPS,
				expires: inSevenDays,
			})
	}

	return {
		token,
	}
}
