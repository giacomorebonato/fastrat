import { ClientOnly } from 'vike-react/ClientOnly'
import { NoteList } from '#features/notes/note-list'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'

export function Page({ noteId }: { noteId: string }) {
	useNoteSubscriptions()

	return (
		<div className='flex flex-col md:flex-row'>
			<div className='flex-1'>
				<ClientOnly
					deps={[noteId]}
					fallback={<span>Loading</span>}
					load={async () =>
						await import('#features/notes/note-textarea').then((c) => ({
							default: c.NoteTextarea,
						}))
					}
				>
					{(Component) => <Component id={noteId} />}
				</ClientOnly>
			</div>

			<div className='flex-1'>
				<NoteList />
			</div>
		</div>
	)
}
