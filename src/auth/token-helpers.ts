import { createSigner, createVerifier } from 'fast-jwt'
import type { ZodRawShape, z } from 'zod'

export const createToken = <T extends object>(
	params: T,
	options: {
		secret: string
		expiresIn?: string | number | undefined
	},
): string => {
	const signSync = createSigner({
		key: options.secret,
		expiresIn: options.expiresIn,
	})
	const token = signSync(params)

	return token
}

export const parseToken = <T extends ZodRawShape>({
	secret,
	token,
	validator,
}: {
	secret: string
	token: string
	validator: z.ZodObject<T>
}) => {
	const verify = createVerifier({
		ignoreExpiration: false,
		key: secret,
	})
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let payload: any

	try {
		payload = verify(token)
	} catch (error) {
		return null
	}

	const { exp, iat, ...parseable } = payload
	const parsed = validator.parse(parseable)

	return parsed
}
