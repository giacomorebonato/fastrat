import { FileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'
import { Layout } from '#features/browser/layout'
import { SideMenu } from '#features/browser/side-menu'
import { trpcClient } from '#features/browser/trpc-client'
import { NoteList } from '#features/notes/note-list'
import { NoteTextarea } from '#features/notes/note-textarea'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'

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

	const noteQuery = trpcClient.note.get.useQuery(
		{ id: noteId },
		{
			initialData: loaderData?.note,
		},
	)

	return (
		<Layout sidebar={<SideMenu withBookmarks={false} />}>
			<div className='flex flex-col md:flex-row'>
				<Helmet>
					<title>{`Fastrat - ${noteQuery.data?.content.substring(
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
		</Layout>
	)
}
