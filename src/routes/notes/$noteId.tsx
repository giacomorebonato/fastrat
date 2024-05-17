import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'
import { Layout } from '#/browser/layout'
import { SideMenu } from '#/browser/side-menu'
import { trpcClient } from '#/browser/trpc-client'
import { NoteList } from '#/notes/note-list'
import { NoteTextarea } from '#/notes/note-textarea'
import { useNoteSubscriptions } from '../../notes/use-note-subscriptions'

export const Route = createFileRoute('/notes/$noteId')({
	parseParams: (params) => ({
		noteId: z.string().parse(params.noteId),
	}),
	async loader({ context, params }) {
		if (import.meta.env.SSR) {
			const { getNoteById } = await import('#/notes/note-queries')
			const { getNotes } = await import('#/notes/note-queries')
			const note = await getNoteById(params.noteId)

			if (!note) {
				// this redirect is read server side
				// before rendering the React tree
				context.redirect.to = '/notes'
			}

			return {
				note,
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
					<NoteTextarea note={noteQuery.data} />
				</div>

				<div className='flex-1'>
					<NoteList notes={loaderData?.notes} />
				</div>
			</div>
		</Layout>
	)
}
