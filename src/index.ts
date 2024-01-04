import { createServer } from '#features/server/create-server'
import { env } from '#features/server/env.js'

const server = await createServer()

server.listen({
	host: env.HOST,
	port: env.PORT,
})
