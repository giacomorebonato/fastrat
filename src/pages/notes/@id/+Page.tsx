import { NotesView } from '#features/notes/notes-view'
import { ClientOnly } from 'vike-react/ClientOnly'

// import { ClientOnly } from '#features/server/client-only'

export function Page({ noteId }: { noteId: string }) {
	return (
		<div className='grid grid-flow-col grid-cols-2 grid-rows-1 gap-x-2'>
			<NotesView />

			<ClientOnly
				fallback={<span>Loading</span>}
				load={async () =>
					await import('#features/notes/create-note-view').then((c) => ({
						default: c.CreateNoteView,
					}))
				}
			>
				{(Component) => <Component id={noteId} />}
			</ClientOnly>
		</div>
	)
}
