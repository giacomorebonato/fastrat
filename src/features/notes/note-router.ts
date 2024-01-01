import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { eq } from 'drizzle-orm'
import { Emitter } from 'strict-event-emitter'
import { z } from 'zod'
import { noteSchema } from '#features/db/schema'
import { publicProcedure, router } from '#features/server/trpc-server'
import { NoteSelect, insertNoteSchema } from './note-schema'
import { desc } from 'drizzle-orm'

type Events = {
	onDelete: [{ id: string }]
	onUpsert: [NoteSelect]
}

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var noteEmitter: Emitter<Events>
}

globalThis.noteEmitter ??= new Emitter<Events>()

export const noteRouter = router({
	onDelete: publicProcedure.subscription(() => {
		return observable<{ id: string }>((emit) => {
			const emitNote = (data: { id: string }) => {
				emit.next(data)
			}
			noteEmitter.on('onDelete', emitNote)

			return () => {
				noteEmitter.off('onDelete', emitNote)
			}
		})
	}),
	onUpsert: publicProcedure.subscription(() => {
		return observable<NoteSelect>((emit) => {
			const emitNote = (note: NoteSelect) => {
				emit.next(note)
			}
			noteEmitter.on('onUpsert', emitNote)

			return () => {
				noteEmitter.off('onUpsert', emitNote)
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

			noteEmitter.emit('onDelete', { id: input.id })

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
		const notes = await ctx.db
			.select()
			.from(noteSchema)
			.orderBy(desc(noteSchema.createdAt))

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

			noteEmitter.emit('onUpsert', notes[0])

			return notes[0]
		}),
})
