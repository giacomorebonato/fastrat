import { env } from '#features/server/env'
import { publicProcedure, router } from '#features/server/trpc-server'
import { USER_TOKEN } from './cookies'

export const authRouter = router({
	logout: publicProcedure.mutation(({ ctx }) => {
		ctx.reply.clearCookie(USER_TOKEN, {
			httpOnly: true,
			path: '/',
			secure: env.NODE_ENV === 'production',
			signed: env.NODE_ENV === 'production',
		})

		return
	}),
	profile: publicProcedure.query(({ ctx }) => {
		return ctx.user
	}),
})
