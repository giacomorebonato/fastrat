import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { navigate } from 'vike/client/router'
import { trpcClient } from '#features/browser/trpc-client'
import { NoteRow } from './note-row'
import { NoteSelect } from './note-schema'

export function NotesView() {
	const queryClient = useQueryClient()
	const getNotes = trpcClient.note.list.useQuery()
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
		},
	})
	const upsertNote = trpcClient.note.upsert.useMutation({
		onError(error) {
			toast(error.message)
		},
		onSuccess(data) {
			navigate(`/notes/${data.id}`)
		},
	})

	return (
		<div
			className='grid grid-flow-row grid-cols-1 gap-1 p-4'
			style={{
				viewTransitionName: 'hero',
			}}
		>
			{getNotes.isLoading ? (
				<span className='loading loading-dots loading-sm' />
			) : (
				<button
					type='button'
					className='btn btn-secondary btn-sm'
					onClick={() => {
						upsertNote.mutate({
							content: 'Write something',
							id: crypto.randomUUID(),
						})
					}}
				>
					Create Note
				</button>
			)}

			{getNotes.data && (
				<div className='h-[calc(100vh-160px)]'>
					{getNotes.data.map((note) => {
						return <NoteRow note={note} key={note.id} />
					})}
				</div>
			)}
		</div>
	)
}
