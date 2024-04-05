import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { Layout } from '#/browser/layout'
import { SideMenu } from '#/browser/side-menu'
import logo from '#/images/logo.jpg'
import { NoteList } from '#/notes/note-list'
import { useNoteSubscriptions } from '#/notes/use-note-subscriptions'

export const Route = createFileRoute('/notes/')({
	component: IndexComponent,
	async loader() {
		if (import.meta.env.SSR) {
			const { getNotes } = await import('#/notes/note-queries')

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
		<Layout sidebar={<SideMenu withBookmarks={false} />}>
			<div className='flex flex-col md:flex-row'>
				<Helmet>
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
				</Helmet>
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
				<div className='flex-1'>
					<NoteList notes={loaderData?.notes} />
				</div>
			</div>
		</Layout>
	)
}
