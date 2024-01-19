import { FileRoute } from '@tanstack/react-router'
import WhyFastRat from '#features/blog/why-fastrat.mdx'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { CustomHead } from '#features/server/custom-head'

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
				<meta property='og:title' content='FastRat - Modern Web Development' />
				<meta
					property='og:description'
					content='A starter kit for building web application and SSR ready when SEO matters.'
				/>
				<meta property='og:type' content='website' />
			</CustomHead>

			<div className='prose mx-auto py-8'>
				<WhyFastRat />
			</div>
		</div>
	)
}
