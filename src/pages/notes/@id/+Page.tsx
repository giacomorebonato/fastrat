import { ClientOnly } from 'vike-react/ClientOnly'
import { NotesView } from '#features/notes/notes-view'
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
						await import('#features/notes/create-note-input').then((c) => ({
							default: c.CreateNoteInput,
						}))
					}
				>
					{(Component) => <Component id={noteId} />}
				</ClientOnly>
			</div>

			<div className='flex-1'>
				<NotesView />
			</div>
		</div>
	)
}
