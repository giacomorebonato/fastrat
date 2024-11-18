import type { UnsignResult } from '@fastify/cookie'
import { addDays, addMinutes } from 'date-fns'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastratServer } from '#/server/create-server'
import { env } from '#/server/env'
import { createToken } from './token-helpers'

export const USER_TOKEN =
	env.NODE_ENV === 'production' && !env.CI ? '__Host-userToken' : 'userToken'

export const REFRESH_TOKEN =
	env.NODE_ENV === 'production' && !env.CI
		? '__Host-refreshToken'
		: 'refreshToken'

function getBasicCookieProps(isHttps = true) {
	const BASIC_COOKIE_PROPS = {
		httpOnly: true,
		path: '/',
		secure: isHttps,
		signed: isHttps,
		SameSite: 'Lax',
	} as const

	return { ...BASIC_COOKIE_PROPS }
}

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
	const cookieProps = getBasicCookieProps()
	reply
		.clearCookie(USER_TOKEN, {
			...cookieProps,
		})
		.clearCookie(REFRESH_TOKEN, {
			...cookieProps,
		})
}

export async function setAuthentication({
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
	const dbUser = await server.queries.user.upsert({
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
	const cookieProps = getBasicCookieProps()

	if (reply) {
		reply
			.setCookie(USER_TOKEN, token, {
				...cookieProps,
				expires: inTenMinutes,
			})
			.setCookie(REFRESH_TOKEN, token, {
				...cookieProps,
				expires: inSevenDays,
			})
	}

	return {
		token,
	}
}
