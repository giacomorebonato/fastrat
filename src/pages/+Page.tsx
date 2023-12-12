import { NotesView } from '#features/notes/notes-view'

export function Page() {
	return (
		<div className='grid grid-flow-col grid-cols-2 grid-rows-1 gap-x-2'>
			<NotesView />
		</div>
	)
}
