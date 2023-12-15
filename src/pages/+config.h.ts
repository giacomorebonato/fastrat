import { PageShell } from '#features/browser/page-shell'
import { env } from '#features/server/env'
// import logoUrl from '../assets/logo.svg'
import vikeReact from 'vike-react'
import type { Config } from 'vike/types'

// Default configs (can be overridden by pages)
export default {
	Layout: PageShell,

	// <meta name="description">
	description: 'Template for application built with Fastify and React',

	// <link rel="icon" href="${favicon}" />
	// favicon: logoUrl,
	extends: vikeReact,

	// Head,
	// <title>
	title: env.NODE_ENV === 'production' ? 'FastRat' : 'FastRat Local',
} satisfies Config
