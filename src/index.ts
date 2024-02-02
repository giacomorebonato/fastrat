import { createServer } from '#server/create-server'
import { env } from '#server/env.js'

const server = await createServer()

server.listen({
	host: env.HOST,
	port: env.PORT,
})
