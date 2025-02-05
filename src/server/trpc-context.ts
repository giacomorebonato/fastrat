import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { getUserFromRequest } from '#/auth/get-user-from-request'
import type { FastratServer } from './create-server'

export const createTrpcContext =
	(server: FastratServer) =>
	async ({ req: request, res: reply }: CreateFastifyContextOptions) => {
		const context = {
			db: server.db,
			reply,
			request: request,
			user: (
				await getUserFromRequest({
					request,
					reply,
					queries: server.queries,
				})
			).user,
			queries: server.queries,
		}

		return context
	}
