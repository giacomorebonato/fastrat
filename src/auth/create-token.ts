import { createSigner, createVerifier } from 'fast-jwt'
import type { ZodRawShape, z } from 'zod'

export const createToken = <T extends object>(
	params: T,
	secret: string,
): string => {
	const signSync = createSigner({
		key: secret,
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
		ignoreExpiration: true,
		key: secret,
	})
	const payload = verify(token)
	const parsed = validator.parse(payload)

	return parsed
}
