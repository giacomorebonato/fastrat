import Crypto from 'node:crypto'
import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'
import { z } from 'zod'
import { db } from '#features/db/db'
import { env } from '#features/server/env'
import { USER_TOKEN } from './cookies'
import { createToken } from './create-token'
import { userSchema } from './user-schema'

export const googleUserSchema = z.object({
	email: z.string(),
	family_name: z.string(),
	given_name: z.string(),
	id: z.string(),
	locale: z.string(),
	name: z.string(),
	picture: z.string(),
	verified_email: z.boolean(),
})

export const googleAuth = fastifyPlugin<{
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
}>(async (fastify, clientCredentials) => {
	fastify.register(fastifyOauth2, {
		callbackUri: `${env.SITE_URL}/login/google/callback`,
		callbackUriParams: {
			access_type: 'offline', // will tell Google to send a refreshToken too
		},
		credentials: {
			auth: fastifyOauth2.GOOGLE_CONFIGURATION,
			client: {
				id: clientCredentials.GOOGLE_CLIENT_ID,
				secret: clientCredentials.GOOGLE_CLIENT_SECRET,
			},
		},
		name: 'googleOAuth2',
		pkce: 'S256',
		scope: ['profile', 'email'],
		startRedirectPath: '/login/google',
	})

	fastify.get('/login/google/callback', async function (request, reply) {
		try {
			const result =
				await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

			const response = await fetch(
				'https://www.googleapis.com/oauth2/v2/userinfo',
				{
					headers: {
						Authorization: `Bearer ${result.token.access_token}`,
					},
				},
			)
			const userData = await response.json()
			const googleUser = googleUserSchema.parse(userData)
			const userId = Crypto.randomUUID()

			await db
				.insert(userSchema)
				.values({
					email: googleUser.email,
					id: userId,
				})
				.onConflictDoUpdate({
					set: {
						updatedAt: new Date(),
					},
					target: userSchema.id,
				})
			const token = createToken(
				{
					email: googleUser.email,
					userId,
				},
				env.SECRET,
			)
			const inSevenDays = new Date()

			inSevenDays.setDate(inSevenDays.getDate() + 7)

			reply
				.setCookie(USER_TOKEN, token, {
					expires: inSevenDays,
					httpOnly: true,
					path: '/',
					secure: env.NODE_ENV === 'production',
					signed: env.NODE_ENV === 'production',
				})
				.redirect('/')
		} catch (error) {
			reply.send(error)
		}
	})
})
