// import logoUrl from '../assets/logo.svg'
import vikeReact from 'vike-react'
import type { Config } from 'vike/types'
import { PageShell } from '#features/browser/page-shell'
import { Head } from '#features/browser/head'

export default ({
	Layout: PageShell,

	// <meta name="description">
	description: 'Template for application built with Fastify and React',

	// <link rel="icon" href="${favicon}" />
	// favicon: logoUrl,
	extends: vikeReact,
	passToClient: ['siteUrl'],
	Head,
	// <title>
	title: process.env.NODE_ENV === 'production' ? 'FastRat' : 'FastRat Local',
} satisfies Config)
