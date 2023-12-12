import { publicProcedure, router } from '#features/server/trpc-server'
import { insertUserSchema, userSchema } from './user-schema'

export const authRouter = router({
	signUp: publicProcedure
		.input(insertUserSchema)
		.mutation(async ({ ctx, input }) => {
			const result = ctx.db
				.insert(userSchema)
				.values(input)
				.onConflictDoUpdate({
					set: {
						lastLoginAt: new Date(),
					},
					target: userSchema.id,
				})

			return {}
		}),
})
