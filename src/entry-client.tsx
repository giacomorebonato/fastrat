import ReactDOM from 'react-dom/client'

import { StartClient } from '@tanstack/react-router-server/client'
import { createRouter } from './create-router'
import React from 'react'

const router = createRouter()
router.hydrate()

ReactDOM.hydrateRoot(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	document.getElementById('root')!,
	<React.StrictMode>
		<StartClient router={router} />
	</React.StrictMode>,
)
