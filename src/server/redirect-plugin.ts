import { fastifyPlugin } from 'fastify-plugin'

export const redirectPlugin = fastifyPlugin<{
	hostNamesRedirectFrom: string[]
	hostNameRedirectTo: string
}>(async (fastify, options) => {
	fastify.addHook('onRequest', (request, reply, done) => {
		request.log.info({
			hostname: request.hostname,
			hostNamesRedirectFrom: options.hostNamesRedirectFrom,
		})

		if (options.hostNamesRedirectFrom.includes(request.hostname)) {
			return reply.redirect(`${options.hostNameRedirectTo}${request.url}`, 301)
		}

		done()
	})
})

export default redirectPlugin
