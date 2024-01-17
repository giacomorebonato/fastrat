import { FileRoute } from '@tanstack/react-router'
import { NoteList } from '#features/notes/note-list'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { CustomHead } from '#features/server/custom-head'
import logo from '#images/logo.jpg'

export const Route = new FileRoute('/').createRoute({
	component: IndexComponent,
})

function IndexComponent() {
	useNoteSubscriptions()

	return (
		<div className='flex flex-col md:flex-row'>
			<CustomHead>
				<title>FastRat</title>
				<meta
					name='description'
					content='A starter kit for fully typesafe monolyth. With Fastify + React (SSR).'
				/>
				<meta property='og:title' content='FastRat' />
				<meta
					property='og:description'
					content='A starter kit for building web application and SSR ready when SEO matters.'
				/>
				<meta property='og:type' content='website' />
			</CustomHead>
			<div className='flex justify-center p-4 flex-1'>
				<img
					src={logo}
					alt='A rat going fast on their skateboard'
					className='rounded max-h-80'
				/>
			</div>
			<div className='flex-1'>
				<NoteList />
			</div>
		</div>
	)
}
