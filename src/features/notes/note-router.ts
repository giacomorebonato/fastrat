import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { eq } from 'drizzle-orm'
import { Emitter } from 'strict-event-emitter'
import { z } from 'zod'
import { noteSchema } from '#features/db/schema'
import { publicProcedure, router } from '#features/server/trpc-server'
import { NoteSelect, insertNoteSchema } from './note-schema'

type Events = {
	onDelete: [{ id: string }]
	onUpsert: [NoteSelect]
}

const emitter = new Emitter<Events>()

export const noteRouter = router({
	onUpsert: publicProcedure.subscription(() => {
		return observable<NoteSelect>((emit) => {
			const emitNote = (note: NoteSelect) => {
				emit.next(note)
			}
			emitter.on('onUpsert', emitNote)

			return () => {
				emitter.off('onUpsert', emitNote)
			}
		})
	}),
	delete: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You need to be authenticated',
				})
			}

			const result = await ctx.db
				.delete(noteSchema)
				.where(eq(noteSchema.id, input.id))

			if (result.rowsAffected === 0) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			emitter.emit('onDelete', { id: input.id })

			return { id: input.id }
		}),
	get: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const note = await ctx.db
				.select()
				.from(noteSchema)
				.where(eq(noteSchema.id, input.id))
				.get()

			if (!note) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Note not found' })
			}

			return note
		}),
	list: publicProcedure.query(async ({ ctx }) => {
		const notes = await ctx.db.select().from(noteSchema)

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
			if (!ctx.user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You need to be authenticated',
				})
			}

			const notes = await ctx.db
				.insert(noteSchema)
				.values({ ...input, updatedAt: new Date(), creatorId: ctx.user.userId })
				.returning()
				.onConflictDoUpdate({
					set: input,
					target: noteSchema.id,
				})
				.all()

			emitter.emit('onUpsert', notes[0])

			return notes[0]
		}),
})
