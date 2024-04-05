import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import WhyFastRat from '#/blog/why-fastrat.mdx'
import { Layout } from '#/browser/layout'
import { SideMenu } from '#/browser/side-menu'
import { useNoteSubscriptions } from '#/notes/use-note-subscriptions'

export const Route = createFileRoute('/')({
	component: IndexComponent,
})

function IndexComponent() {
	useNoteSubscriptions()

	return (
		<Layout sidebar={<SideMenu withBookmarks />}>
			<div className='flex flex-col md:flex-row'>
				<Helmet>
					<title>React Fastify Starter Kit - Build SSR Apps with Ease</title>
					<meta
						name='description'
						content='Get started with React and Fastify server-side rendering (SSR). Our starter kit simplifies development and provides a robust foundation for your projects.'
					/>
					<meta
						name='keywords'
						content='React, Fastify, SSR, starter kit, template, server-side rendering'
					/>
					<meta property='og:title' content='FastRat - Fastify + React' />
					<meta
						property='og:description'
						content='A starter kit for building web application and SSR ready when SEO matters.'
					/>
					<meta property='og:type' content='website' />
				</Helmet>

				<main className='prose mx-auto py-8 px-4 md:px-0 text-lg w-full'>
					<WhyFastRat />
				</main>
			</div>
		</Layout>
	)
}
