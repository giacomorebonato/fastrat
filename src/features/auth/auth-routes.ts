import { publicProcedure, router } from '#features/server/trpc-server'

export const authRouter = router({
	logout: publicProcedure.mutation(({ ctx }) => {
		ctx.reply.clearCookie('user')

		return
	}),
	profile: publicProcedure.query(({ ctx }) => {
		return ctx.user
	}),
})
