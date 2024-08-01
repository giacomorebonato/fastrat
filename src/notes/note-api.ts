import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { Emitter } from 'strict-event-emitter'
import { z } from 'zod'
import { type NoteSelect, insertNoteSchema } from '#/db/note-table'
import { env } from '#/server/env'
import { publicProcedure, router } from '#/server/trpc-server'

type Events = {
	onDelete: [{ id: string }]
	onUpsert: [NoteSelect]
}

declare global {
	var noteEmitter: Emitter<Events>
}

globalThis.noteEmitter ??= new Emitter<Events>()

export const noteApi = router({
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
		.mutation(({ input, ctx }) => {
			if (env.GOOGLE_CLIENT_ID && !ctx.user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You need to be authenticated',
				})
			}

			const result = ctx.queries.note.delete(input.id)

			if (result.changes === 0) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			noteEmitter.emit('onDelete', { id: input.id })

			return { id: input.id }
		}),
	get: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			const note = ctx.queries.note.byId(input.id)

			if (!note) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Note not found' })
			}

			return note
		}),
	list: publicProcedure.query(({ ctx }) => {
		return ctx.queries.note.list()
	}),
	upsert: publicProcedure
		.input(
			insertNoteSchema.omit({
				createdAt: true,
				updatedAt: true,
			}),
		)
		.mutation(({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You need to be authenticated',
				})
			}

			const note = ctx.queries.note.upsert({
				...input,
				updatedAt: new Date(),
				creatorId: ctx.user.userId,
			})

			noteEmitter.emit('onUpsert', note)

			return note
		}),
})
