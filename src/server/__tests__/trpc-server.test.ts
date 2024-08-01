import Crypto from 'node:crypto'
import superjson from 'superjson'
import { expect, test } from 'vitest'
import { USER_TOKEN } from '#/auth/cookies'
import { createToken } from '#/auth/create-token'
import { createServer } from '#/server/create-server'
import { env } from '../env'

test('CRUD notes through API calls', async () => {
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
		env.SECRET,
	)

	const createResponse = await server.inject({
		url: '/trpc/note.upsert',
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		cookies: {
			[USER_TOKEN]: token,
		},
		body: superjson.stringify({
			id: Crypto.randomUUID(),
			content: 'Beautiful day',
		}),
	})

	expect(createResponse.statusCode).equals(200)

	const listResponse2 = await server.inject({
		url: '/trpc/note.list',
	})

	expect(listResponse2.json().result.data.json).to.toHaveLength(1)
})
