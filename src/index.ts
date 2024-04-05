import { createServer } from '#/server/create-server'
import { env } from '#/server/env.js'

async function start() {
	try {
		const server = await createServer()

		await server.listen({
			host: env.HOST,
			port: env.PORT,
		})
	} catch (error) {
		console.error(`Error starting server`)
		throw error
	}
}

start()
