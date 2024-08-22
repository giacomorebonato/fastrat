import ReactDOM from 'react-dom/client'

import { RouterProvider } from '@tanstack/react-router'
import { StartClient } from '@tanstack/start'
import React from 'react'
import { createRouter } from './browser/create-router'

const router = createRouter()
const divRoot = document.getElementById('root') as HTMLDivElement

declare global {
	var __TSR__: unknown
	var IS_PWA: boolean
}

// innerHTML contains just the placeholder when nothing has been server rendered
// it happens in PWA mode
if (divRoot.innerHTML === '<!--app-html-->') {
	globalThis.__TSR__ = undefined
	globalThis.IS_PWA = true
	const root = ReactDOM.createRoot(divRoot)
	root.render(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>,
	)
} else {
	globalThis.IS_PWA = false
	ReactDOM.hydrateRoot(
		divRoot,
		<React.StrictMode>
			<StartClient router={router} />
		</React.StrictMode>,
	)
}
