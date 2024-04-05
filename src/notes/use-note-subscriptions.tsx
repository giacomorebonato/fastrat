import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { trpcClient } from '#/browser/trpc-client'
import type { NoteSelect } from '#/db/note-table'

export const useNoteSubscriptions = () => {
	const queryClient = useQueryClient()

	trpcClient.note.onDelete.useSubscription(undefined, {
		onData(data) {
			queryClient.setQueryData(
				[
					['note', 'list'],
					{
						type: 'query',
					},
				],
				(oldData: NoteSelect[] | undefined) => {
					return oldData?.filter((item) => item.id !== data.id)
				},
			)
		},
	})

	trpcClient.note.onUpsert.useSubscription(undefined, {
		onError(error) {
			toast(error.message)
		},
		onData(subscribedNote) {
			queryClient.setQueryData(
				[
					['note', 'list'],
					{
						type: 'query',
					},
				],
				(oldData: NoteSelect[] | undefined) => {
					if (!oldData) {
						return []
					}
					if (oldData.every((note) => note.id !== subscribedNote.id)) {
						return [...oldData, subscribedNote]
					}

					return oldData.map((note) => {
						if (note.id === subscribedNote.id) {
							return { ...subscribedNote }
						}

						return { ...note }
					})
				},
			)

			queryClient.setQueryData(
				[
					['note', 'get'],
					{
						input: { id: subscribedNote.id },
						type: 'query',
					},
				],
				() => {
					return subscribedNote
				},
			)
		},
	})
}
