import { expect, test, vi } from 'vitest'
import { z } from 'zod'
import { createToken, parseToken } from '#/auth/token-helpers'

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
	const token = createToken<typeof myData>(myData, { secret, expiresIn: '10m' })

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
	const token = createToken<typeof myData>(myData, { secret, expiresIn: '10m' })

	expect(() => {
		parseToken({
			secret,
			token,
			validator,
		})
	}).throws()
})

test(`it let the token expire and then it's parsed as null`, () => {
	vi.useFakeTimers()
	const myData = {
		a: 1,
		test: 'hello',
	} as const
	const validator = z.object({
		a: z.number(),
		test: z.string(),
	})

	const secret = 'my-secret'
	const token = createToken<typeof myData>(myData, { secret, expiresIn: '5m' })

	let result = parseToken({
		secret,
		token,
		validator,
	})

	expect(result).toStrictEqual(myData)

	vi.advanceTimersByTime(1_000 * 60 * 10)

	result = parseToken({
		secret,
		token,
		validator,
	})

	expect(result).toBe(null)

	vi.useRealTimers()
})
