import { ClientOnly } from 'vike-react/ClientOnly'
import { NotesView } from '#features/notes/notes-view'

export function Page({ noteId }: { noteId: string }) {
	return (
		<div className='flex flex-col md:flex-row'>
			<ClientOnly
				deps={[noteId]}
				fallback={<span>Loading</span>}
				load={async () =>
					await import('#features/notes/create-note-input').then((c) => ({
						default: c.CreateNoteInput,
					}))
				}
			>
				{(Component) => <Component id={noteId} />}
			</ClientOnly>

			<NotesView />
		</div>
	)
}
