import { NotesView } from '#features/notes/notes-view'
import logo from '#images/logo.jpg'

export function Page() {
	return (
		<div className='grid grid-flow-col grid-cols-2 grid-rows-1 gap-x-2'>
			<NotesView />
			<div className='flex justify-center p-4'>
				<img
					src={logo}
					alt='A rat going fast on their skateboard'
					className='rounded max-h-80'
				/>
			</div>
		</div>
	)
}
