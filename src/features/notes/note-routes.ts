import { TRPCError } from '@trpc/server'
import { noteSchema } from '#features/db/schema'
import { publicProcedure, router } from '#features/server/trpc-server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { insertNoteSchema } from './note-schema'

export const noteRouter = router({
	delete: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(({ ctx, input }) => {
			const result = ctx.db
				.delete(noteSchema)
				.where(eq(noteSchema.id, input.id))
				.run()

			if (result.changes === 0) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			return { id: input.id }
		}),
	get: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			const note = ctx.db
				.select()
				.from(noteSchema)
				.where(eq(noteSchema.id, input.id))
				.get()

			if (!note) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			return note
		}),
	list: publicProcedure.query(({ ctx }) => {
		const notes = ctx.db.select().from(noteSchema)

		return notes
	}),
	upsert: publicProcedure
		.input(
			insertNoteSchema.omit({
				createdAt: true,
				updatedAt: true,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const note = ctx.db
				.insert(noteSchema)
				.values({ ...input, updatedAt: new Date() })
				.returning()
				.onConflictDoUpdate({
					set: input,
					target: noteSchema.id,
				})
				.all()

			return note[0]
		}),
})
