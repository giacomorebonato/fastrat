import Fs from 'node:fs'
import Path from 'node:path'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import appRootPath from 'app-root-path'
import { type FastifyServerOptions, fastify } from 'fastify'
import { googleAuth } from '#/auth/google-auth'
import { collabPlugin } from '#/collab/collab-plugin'
import { apiRouter } from './api-router'
import type { Env } from './env'
import { createTrpcContext } from './trpc-context'

const certPath = Path.join(appRootPath.path, 'localhost.pem')
const keyPath = Path.join(appRootPath.path, 'localhost-key.pem')
const isHttps = Fs.existsSync(certPath) && Fs.existsSync(keyPath)

export async function createServer(
	fastifyOptions: FastifyServerOptions = {
		logger: true,
		maxParamLength: 5_000,
		trustProxy: true,
	},
	options: {
		env?: Env
		skipVite: boolean
	} = {
		skipVite: false,
	},
) {
	if (!options.env) {
		throw Error(`Specify an env file`)
	}

	const server = fastify({
		...fastifyOptions,
		...(isHttps
			? {
					https: {
						key: Fs.readFileSync(keyPath),
						cert: Fs.readFileSync(certPath),
					},
				}
			: null),
	})

	await server
		.register(import('#/db/db-plugin'), {
			dbUrl: options.env.DATABASE_URL,
			dbToken: options.env.DATABASE_TOKEN,
		})
		.register(import('./redirect-plugin'), {
			hostNamesRedirectFrom: options.env.HOST_NAMES_REDIRECT_FROM,
			hostNameRedirectTo: options.env.SITE_URL,
		})

	if (!options.skipVite) {
		await server.register(import('./vite-plugin'), {
			nodeEnv: options.env.NODE_ENV,
		})
	}

	server
		.register(import('@fastify/cookie'), {
			hook: 'onRequest',
			secret: options.env.SECRET,
		})
		.register(import('@fastify/websocket'))
		.register(googleAuth, {
			GOOGLE_CLIENT_ID: options.env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: options.env.GOOGLE_CLIENT_SECRET,
		})
		.register(fastifyTRPCPlugin, {
			prefix: '/trpc',
			trpcOptions: {
				createContext: createTrpcContext(server),
				router: apiRouter,
			},
			useWSS: true,
		})
		.register(collabPlugin)
		.ready()

	return await server
}

export type FastratServer = Awaited<ReturnType<typeof createServer>>
