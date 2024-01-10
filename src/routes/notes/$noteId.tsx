import { FileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NoteList } from '#features/notes/note-list'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { NoteTextarea } from '#features/notes/note-textarea'

export const Route = new FileRoute('/notes/$noteId').createRoute({
	parseParams: (params) => ({
		noteId: z.string().parse(params.noteId),
	}),
	loader: async ({ params }) => {
		return {
			noteId: params.noteId,
		}
	},
	component: NoteComponent,
})

function NoteComponent() {
	useNoteSubscriptions()
	const loaderData = Route.useLoaderData()

	return (
		<div className='flex flex-col md:flex-row'>
			<div className='flex-1'>
				<NoteTextarea noteId={loaderData.noteId} />
			</div>

			<div className='flex-1'>
				<NoteList />
			</div>
		</div>
	)
}
