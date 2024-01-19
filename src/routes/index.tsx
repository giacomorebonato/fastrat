import { FileRoute } from '@tanstack/react-router'
import WhyFastRat from '#features/blog/why-fastrat.mdx'
import { NoteList } from '#features/notes/note-list'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { CustomHead } from '#features/server/custom-head'
import logo from '#images/logo.jpg'

export const Route = new FileRoute('/').createRoute({
	component: IndexComponent,
	async loader() {
		if (import.meta.env.SSR) {
			const { getNotes } = await import('#features/notes/note-queries')

			return {
				notes: await getNotes(),
			}
		}
	},
})

function IndexComponent() {
	useNoteSubscriptions()
	const loaderData = Route.useLoaderData()

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

			<div className='prose mx-auto'>
				<div className='flex justify-center p-4 flex-1'>
					<div>
						<img
							src={logo}
							alt='A rat going fast on their skateboard'
							className='rounded'
							width={400}
							height={400}
						/>
					</div>
				</div>
				<WhyFastRat />
			</div>
		</div>
	)
}
