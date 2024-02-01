import { FileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import WhyFastRat from '#features/blog/why-fastrat.mdx'
import { useNoteSubscriptions } from '#features/notes/use-note-subscriptions'
import { Layout } from '#features/browser/layout'
import { SideMenu } from '#features/browser/side-menu'

export const Route = new FileRoute('/').createRoute({
	component: IndexComponent,
})

function IndexComponent() {
	useNoteSubscriptions()

	return (
		<Layout sidebar={<SideMenu />}>
			<div className='flex flex-col md:flex-row'>
				<Helmet>
					<title>FastRat</title>
					<meta
						name='description'
						content='A starter kit for fully typesafe monolyth. With Fastify + React (SSR).'
					/>
					<meta
						property='og:title'
						content='FastRat - Modern Web Development'
					/>
					<meta
						property='og:description'
						content='A starter kit for building web application and SSR ready when SEO matters.'
					/>
					<meta property='og:type' content='website' />
				</Helmet>

				<main className='prose mx-auto py-8 font-cardo px-4 md:px-0 text-lg'>
					<WhyFastRat />
				</main>
			</div>
		</Layout>
	)
}
