import Crypto from 'node:crypto'
import superjson from 'superjson'
import { expect, test, vi } from 'vitest'
import * as CookieHelpers from '#/auth/cookie-helpers'
import { createToken } from '#/auth/token-helpers'
import { createServer } from '#/server/create-server'
import { env } from '../env'

test('CRUD notes through API calls', async () => {
	vi.useFakeTimers({
		shouldAdvanceTime: true,
	})
	const server = await createServer(undefined, {
		env: {
			...env,
			DATABASE_URL: ':memory:',
		},
		skipVite: true,
	})

	const listResponse = await server.inject({
		url: '/trpc/note.list',
	})

	const { result } = listResponse.json()
	expect(result.data.json).to.toHaveLength(0)

	const token = createToken(
		{
			email: `test@email.com`,
			userId: Crypto.randomUUID(),
		},
		{
			secret: env.SECRET,
			expiresIn: '10m',
		},
	)

	const sessionId = Crypto.randomUUID()
	const userId = Crypto.randomUUID()

	server.queries.user.upsert({
		id: userId,
		email: 'test@email.com',
	})
	server.queries.session.upsert({
		id: sessionId,
		userAgent: 'Firefox',
		disabled: false,
		userId: userId,
	})

	let createResponse = await server.inject({
		url: '/trpc/note.upsert',
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		cookies: {
			[CookieHelpers.USER_TOKEN]: token,
			[CookieHelpers.REFRESH_TOKEN]: sessionId,
		},
		body: superjson.stringify({
			id: Crypto.randomUUID(),
			content: 'Beautiful day',
		}),
	})

	expect(createResponse.statusCode).equals(200)

	createResponse = await server.inject({
		url: '/trpc/note.upsert',
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		cookies: {
			[CookieHelpers.USER_TOKEN]: token,
		},
		body: superjson.stringify({
			id: Crypto.randomUUID(),
			content: 'Beautiful day',
		}),
	})

	expect(createResponse.statusCode).equals(200)

	const setAuthenticationSpy = vi.spyOn(CookieHelpers, 'setAuthentication')

	createResponse = await server.inject({
		url: '/trpc/note.upsert',
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		cookies: {
			[CookieHelpers.REFRESH_TOKEN]: sessionId,
		},
		body: superjson.stringify({
			id: Crypto.randomUUID(),
			content: 'Beautiful day',
		}),
	})

	expect(createResponse.statusCode).toBe(200)
	expect(setAuthenticationSpy).toBeCalledTimes(1)

	vi.advanceTimersByTime(1_000 * 60 * 60)

	createResponse = await server.inject({
		url: '/trpc/note.upsert',
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		cookies: {
			[CookieHelpers.REFRESH_TOKEN]: sessionId,
			[CookieHelpers.USER_TOKEN]: token,
		},
		body: superjson.stringify({
			id: Crypto.randomUUID(),
			content: 'Beautiful day',
		}),
	})

	expect(createResponse.statusCode).toBe(200)
	expect(setAuthenticationSpy).toBeCalledTimes(2)

	const listResponse2 = await server.inject({
		url: '/trpc/note.list',
	})

	expect(listResponse2.json().result.data.json).to.toHaveLength(4)
})
