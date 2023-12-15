import { publicProcedure, router } from '#features/server/trpc-server'
import { USER_TOKEN } from './cookies'

export const authRouter = router({
	logout: publicProcedure.mutation(({ ctx }) => {
		ctx.reply.clearCookie(USER_TOKEN)

		return
	}),
	profile: publicProcedure.query(({ ctx }) => {
		return ctx.user
	}),
})
