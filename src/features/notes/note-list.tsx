import { toast } from 'react-toastify'
import { trpcClient } from '#features/browser/trpc-client'
import { NoteRow } from './note-row'
import { useNavigate } from '@tanstack/react-router'

export function NoteList() {
	const navigate = useNavigate()
	const getNotes = trpcClient.note.list.useQuery()

	const upsertNote = trpcClient.note.upsert.useMutation({
		onError(error) {
			toast(error.message)
		},
		onSuccess(data) {
			navigate({
				to: `/notes/$noteId`,
				params: {
					noteId: data.id,
				},
			})
		},
	})

	return (
		<div
			className='grid grid-flow-row grid-cols-1 gap-1 p-4'
			data-testid='note-list'
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
