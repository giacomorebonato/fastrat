import { NotesView } from '#features/notes/notes-view'

export function Page() {
	return (
		<div className='grid grid-flow-col grid-cols-2 grid-rows-1 gap-x-2'>
			<NotesView />
		</div>
	)
}

const ws = new WebSocket('ws://localhost:3000/ws')

ws.onopen = (message) => {
	console.log('open', message)
}

ws.onmessage = (message) => {
	console.log(message)
}

ws.onerror = (error) => {
	console.log(error)
}
