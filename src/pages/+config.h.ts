import type { Config } from 'vike/types'
// import logoUrl from '../assets/logo.svg'
import vikeReact from 'vike-react'
import { PageShell } from '#features/browser/page-shell'

// Default configs (can be overridden by pages)
export default {
  Layout: PageShell,
  // Head,
  // <title>
  title: 'My Vike + React App',
  // <meta name="description">
  description: 'Demo showcasing Vike + React',
  // <link rel="icon" href="${favicon}" />
  // favicon: logoUrl,
  extends: vikeReact
} satisfies Config