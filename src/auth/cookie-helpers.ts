import type { UnsignResult } from '@fastify/cookie'
import { addDays, addMinutes } from 'date-fns'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastratServer } from '#/server/create-server'
import { env } from '#/server/env'
import { createToken } from './token-helpers'

function extractDomain(urlString: string) {
	const { hostname } = new URL(urlString)
	return hostname.replace(/^www\./, '')
}

export const USER_TOKEN =
	env.NODE_ENV === 'production' && !env.CI ? '__Host-userToken' : 'userToken'

export const REFRESH_TOKEN =
	env.NODE_ENV === 'production' && !env.CI
		? '__Host-refreshToken'
		: 'refreshToken'

function getBasicCookieProps(request: FastifyRequest) {
	const BASIC_COOKIE_PROPS = {
		domain: extractDomain(env.SITE_URL),
		httpOnly: true,
		path: '/',
		secure: request.protocol === 'https',
		signed: request.protocol === 'https',
		SameSite: 'strict',
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

export function clearAuthCookies(request: FastifyRequest, reply: FastifyReply) {
	const cookieProps = getBasicCookieProps(request)
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
	request,
	user,
}: {
	server: FastratServer
	request: FastifyRequest
	reply: FastifyReply
	user: {
		id: string
		email: string
	}
}): Promise<{ token: string }> {
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
	const cookieProps = getBasicCookieProps(request)

	reply.log.info(
		JSON.stringify({
			msg: 'Setting authentication cookies',
			token,
			cookieProps,
			reply: !!reply,
			protocol: request.protocol,
		}),
	)

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
