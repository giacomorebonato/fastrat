import vikeReact from 'vike-react'
import type { Config } from 'vike/types'
import { Head } from '#features/browser/head'
import { PageShell } from '#features/browser/page-shell'

export default ({
	Layout: PageShell,

	// <meta name="description">
	description: 'Template for application built with Fastify and React',

	// favicon: logoUrl,
	extends: [vikeReact],
	passToClient: ['siteUrl'],
	Head,
	// <title>
	title: process.env.NODE_ENV === 'production' ? 'FastRat' : 'FastRat Local',
} satisfies Config)
