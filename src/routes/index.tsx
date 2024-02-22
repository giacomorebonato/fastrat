import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import WhyFastRat from '#blog/why-fastrat.mdx'
import { Layout } from '#browser/layout'
import { SideMenu } from '#browser/side-menu'
import { useNoteSubscriptions } from '#notes/use-note-subscriptions'

export const Route = createFileRoute('/')({
	component: IndexComponent,
})

function IndexComponent() {
	useNoteSubscriptions()

	return (
		<Layout sidebar={<SideMenu withBookmarks />}>
			<div className='flex flex-col md:flex-row'>
				<Helmet>
					<title>FastRat</title>
					<meta
						name='description'
						content='A starter kit for fully typesafe monolyth. With Fastify + React (SSR).'
					/>
					<meta property='og:title' content='FastRat - Fastify + React' />
					<meta
						property='og:description'
						content='A starter kit for building web application and SSR ready when SEO matters.'
					/>
					<meta
						name='keywords'
						content='Fastify, React, TypeScript, SSR, PWA, SEO'
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
