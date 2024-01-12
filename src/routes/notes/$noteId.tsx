import { FileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NoteList } from '#features/notes/note-list'
import { NoteRecord } from '#features/notes/note-schema'
import { NoteTextarea } from '#features/notes/note-textarea'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { CustomHead } from '#features/server/custom-head'

export const Route = new FileRoute('/notes/$noteId').createRoute({
	parseParams: (params) => ({
		noteId: z.string().parse(params.noteId),
	}),
	async loader({ params }): Promise<NoteRecord | undefined> {
		if (import.meta.env.SSR) {
			const { getNoteById } = await import('#features/notes/note-queries')

			return getNoteById(params.noteId)
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
			<CustomHead>
				<title>{`Fastrat - ${loaderData?.content.substring(0, 20)}`}</title>
			</CustomHead>
			<div className='flex-1'>
				<NoteTextarea noteId={noteId} initalData={loaderData} />
			</div>

			<div className='flex-1'>
				<NoteList />
			</div>
		</div>
	)
}
