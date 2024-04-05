import { expect, test } from 'vitest'
import { z } from 'zod'
import { createToken, parseToken } from '#/auth/create-token'

test('creates a token and parses it back', () => {
	const myData = {
		a: 1,
		test: 'hello',
	} as const
	const validator = z.object({
		a: z.number(),
		test: z.string(),
	})

	const secret = 'my-secret'
	const token = createToken<typeof myData>(myData, secret)

	const result = parseToken({
		secret,
		token,
		validator,
	})

	expect(result).toStrictEqual(myData)
})

test('it throws if the validator fails', () => {
	const myData = {
		a: 1,
		test: 'hello',
	} as const
	const validator = z.object({
		a: z.string(),
		test: z.string(),
	})

	const secret = 'my-secret'
	const token = createToken<typeof myData>(myData, secret)

	expect(() => {
		parseToken({
			secret,
			token,
			validator,
		})
	}).throws()
})
