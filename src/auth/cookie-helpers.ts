import type { UnsignResult } from '@fastify/cookie'
import { addDays, addMinutes } from 'date-fns'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastratServer } from '#/server/create-server'
import { env } from '#/server/env'
import { createToken } from './token-helpers'

export function getUserTokenKey(request?: FastifyRequest) {
	return request?.protocol === 'https' ? '__Host-userToken' : 'userToken'
}

export function getRefreshTokenKey(request?: FastifyRequest) {
	return request?.protocol === 'https' ? '__Host-refreshToken' : 'refreshToken'
}

function getBasicCookieProps(request: FastifyRequest) {
	const isHttps = request.protocol === 'https'
	const BASIC_COOKIE_PROPS = {
		httpOnly: true,
		path: '/',
		secure: isHttps,
		signed: isHttps,
		sameSite: 'lax',
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
		.clearCookie(getUserTokenKey(request), {
			...cookieProps,
		})
		.clearCookie(getRefreshTokenKey(request), {
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
}): Promise<void> {
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

	reply.log.info({
		msg: 'Setting authentication cookies',
		token,
		cookieProps,
		reply: !!reply,
		protocol: request.protocol,
	})

	reply
		.setCookie(getUserTokenKey(request), token, {
			...cookieProps,
			expires: inTenMinutes,
		})
		.setCookie(getRefreshTokenKey(request), token, {
			...cookieProps,
			expires: inSevenDays,
		})
}
