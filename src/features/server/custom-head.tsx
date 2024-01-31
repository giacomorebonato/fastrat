import { ReactNode, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

export const CustomHead = ({ children }: { children: ReactNode }) => {
	const [isMount, setIsMount] = useState(false)

	useEffect(() => {
		setIsMount(true)
	}, [])

	if (import.meta.env.SSR) {
		return (
			<div id='custom-head' style={{ display: 'none' }}>
				{children}
			</div>
		)
	}

	if (isMount) {
		return <Helmet>{children}</Helmet>
	}

	return null
}
