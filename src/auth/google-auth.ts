import { fastifyOauth2 } from '@fastify/oauth2'
import type { FastifyReply } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { z } from 'zod'
import { env } from '#/server/env'
import { USER_TOKEN } from './cookies'
import { createToken } from './create-token'
import { upsertUser } from './user-queries'

export const googleUserSchema = z.object({
	email: z.string(),
	family_name: z.string(),
	given_name: z.string(),
	id: z.string(),
	locale: z.string().default('en'),
	name: z.string(),
	picture: z.string(),
	verified_email: z.boolean(),
})

type GoogleUser = z.infer<typeof googleUserSchema>

const isProduction = env.NODE_ENV === 'production'

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

	if (env.CI) {
		fastify.log.warn(
			`Google credentials not set. Falling back to fake authentication route for testing.`,
		)

		fastify.get('/login/google/ci', async (request, reply) => {
			return await updateDatabaseAndRedirect({
				reply,
				user: {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					email: env.TEST_EMAIL!,
					id: '123',
					name: 'test',
					family_name: 'test',
					locale: 'en',
					verified_email: true,
					given_name: 'test-given-name',
					picture: '',
				},
			})
		})
	}

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
			const user = googleUserSchema.parse(userData)

			await updateDatabaseAndRedirect({
				user,
				reply,
			})
		} catch (error) {
			reply.send(error)
		}
	})
})

async function updateDatabaseAndRedirect({
	reply,
	user,
}: {
	reply: FastifyReply
	user: GoogleUser
}) {
	const dbUser = await upsertUser({ email: user.email })
	const token = createToken(
		{
			email: dbUser.email,
			userId: dbUser.id,
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
			secure: isProduction && !env.CI,
			signed: isProduction && !env.CI,
		})
		.redirect('/')
}
