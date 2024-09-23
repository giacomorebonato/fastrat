import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'
import { z } from 'zod'
import { env } from '#/server/env'
import * as CookieHelpers from './cookie-helpers'

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

export const googleAuth = fastifyPlugin<{
	GOOGLE_CLIENT_ID: string
	GOOGLE_CLIENT_SECRET: string
}>(async (server, clientCredentials) => {
	server.register(fastifyOauth2, {
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
		server.log.warn(
			`Google credentials not set. Falling back to fake authentication route for testing.`,
		)

		server.get('/login/google/ci', async (request, reply) => {
			CookieHelpers.setAuthentication({
				server,
				reply,
				user: {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					email: env.TEST_EMAIL!,
					id: '123',
				},
			})

			reply.redirect('/')
		})
	}

	server.get('/login/google/callback', async function (request, reply) {
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

			CookieHelpers.setAuthentication({
				server,
				user,
				reply,
			})
			reply.redirect('/')
		} catch (error) {
			reply.send(error)
		}
	})
})
