import { publicProcedure, router } from '#/server/trpc-server'
import * as CookieHelpers from './cookie-helpers'

export const authApi = router({
	logout: publicProcedure.mutation(({ ctx }) => {
		CookieHelpers.clearAuthCookies(ctx.reply)

		return
	}),
	profile: publicProcedure.query(({ ctx }) => {
		return ctx.user
	}),
})
