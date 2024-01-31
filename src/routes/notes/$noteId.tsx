import { FileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NoteList } from '#features/notes/note-list'
import { NoteTextarea } from '#features/notes/note-textarea'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { Helmet } from 'react-helmet-async'

export const Route = new FileRoute('/notes/$noteId').createRoute({
	parseParams: (params) => ({
		noteId: z.string().parse(params.noteId),
	}),
	async loader({ params }) {
		if (import.meta.env.SSR) {
			const { getNoteById } = await import('#features/notes/note-queries')
			const { getNotes } = await import('#features/notes/note-queries')

			return {
				note: await getNoteById(params.noteId),
				notes: await getNotes(),
			}
		}
	},
	component: NoteComponent,
})

function NoteComponent() {
	useNoteSubscriptions()
	const { noteId } = Route.useParams()
	const loaderData = Route.useLoaderData()

	return (
		<div className='flex flex-col md:flex-row'>
			<Helmet>
				<title>{`Fastrat - ${loaderData?.note?.content.substring(
					0,
					20,
				)}`}</title>
			</Helmet>
			<div className='flex-1'>
				<NoteTextarea noteId={noteId} initalData={loaderData?.note} />
			</div>

			<div className='flex-1'>
				<NoteList notes={loaderData?.notes} />
			</div>
		</div>
	)
}
