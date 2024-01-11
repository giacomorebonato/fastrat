import { FileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NoteList } from '#features/notes/note-list'
import { NoteTextarea } from '#features/notes/note-textarea'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'

export const Route = new FileRoute('/notes/$noteId').createRoute({
	parseParams: (params) => ({
		noteId: z.string().parse(params.noteId),
	}),
	component: NoteComponent,
})

function NoteComponent() {
	useNoteSubscriptions()
	const { noteId } = Route.useParams()

	return (
		<div className='flex flex-col md:flex-row'>
			<div className='flex-1'>
				<NoteTextarea noteId={noteId} />
			</div>

			<div className='flex-1'>
				<NoteList />
			</div>
		</div>
	)
}
