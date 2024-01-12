import { ReactNode } from 'react'

export const CustomHead = ({ children }: { children: ReactNode }) => {
	return (
		<div style={{ display: 'none' }} suppressHydrationWarning id='custom-head'>
			{children}
		</div>
	)
}
