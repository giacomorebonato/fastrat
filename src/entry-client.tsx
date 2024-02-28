import ReactDOM from 'react-dom/client'

import { StartClient } from '@tanstack/react-router-server/client'
import React from 'react'
import { createRouter } from './browser/create-router'
import { RouterProvider } from '@tanstack/react-router'

const router = createRouter()
const divRoot = document.getElementById('root') as HTMLDivElement

// innerHTML contains just the placeholder when nothing has been server rendered
// it happens in PWA mode
if (divRoot.innerHTML === '<!--app-html-->') {
	const root = ReactDOM.createRoot(divRoot)
	root.render(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>,
	)
} else {
	router.hydrate()

	ReactDOM.hydrateRoot(
		divRoot,
		<React.StrictMode>
			<StartClient router={router} />
		</React.StrictMode>,
	)
}
