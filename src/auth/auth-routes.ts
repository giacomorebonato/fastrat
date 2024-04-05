import { env } from '#/server/env'
import { publicProcedure, router } from '#/server/trpc-server'
import { USER_TOKEN } from './cookies'

export const authRouter = router({
	logout: publicProcedure.mutation(({ ctx }) => {
		ctx.reply.clearCookie(USER_TOKEN, {
			httpOnly: true,
			path: '/',
			secure: env.NODE_ENV === 'production' && !env.CI,
			signed: env.NODE_ENV === 'production' && !env.CI,
		})

		return
	}),
	profile: publicProcedure.query(({ ctx }) => {
		return ctx.user
	}),
})
