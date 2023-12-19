import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'
import { env } from '#features/server/env'

export const appleAuth = fastifyPlugin(async (fastify) => {
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
})
