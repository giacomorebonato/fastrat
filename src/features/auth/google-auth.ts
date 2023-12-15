import Crypto from 'node:crypto'
import { fastifyOauth2 } from '@fastify/oauth2'
import { db } from '#features/db/db'
import { env } from '#features/server/env'
import { fastifyPlugin } from 'fastify-plugin'
import { z } from 'zod'
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

export const googleAuth = fastifyPlugin(async (fastify) => {
	await fastify.register(fastifyOauth2, {
		callbackUri: `${env.SITE_URL}/login/google/callback`,
		callbackUriParams: {
			access_type: 'offline', // will tell Google to send a refreshToken too
		},
		credentials: {
			auth: fastifyOauth2.GOOGLE_CONFIGURATION,
			client: {
				id: env.GOOGLE_CLIENT_ID,
				secret: env.GOOGLE_CLIENT_SECRET,
			},
		},
		name: 'googleOAuth2',
		pkce: 'S256',
		scope: ['profile', 'email'],
		startRedirectPath: '/login/google',
	})

	fastify.get('/login/google/callback', function (request, reply) {
		this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
			request,
			reply,
			async (err, result) => {
				if (err) {
					reply.send(err)
					return
				}

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

				request.log.info(`Setting userToken: ${token}`)

				reply
					.setCookie(USER_TOKEN, token, {
						expires: inSevenDays,
						httpOnly: true,
						path: '/',
						secure: env.NODE_ENV === 'production',
						signed: env.NODE_ENV === 'production',
					})
					.redirect('/')
			},
		)
	})
})
