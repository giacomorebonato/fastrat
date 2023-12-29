import { NotesView } from '#features/notes/notes-view'
import logo from '#images/logo.jpg'

export function Page() {
	return (
		<div className='flex flex-col md:flex-row'>
			<div className='flex justify-center p-4 flex-1'>
				<img
					src={logo}
					alt='A rat going fast on their skateboard'
					className='rounded max-h-80'
				/>
			</div>
			<div className='flex-1'>
				<NotesView />
			</div>
		</div>
	)
}
