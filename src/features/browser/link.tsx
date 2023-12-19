import clsx from 'clsx'
import React, { ForwardedRef } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { navigate } from 'vike/client/router'

export const Link = React.forwardRef(function LinkWithRef(
	{
		isClientRouting,
		...props
	}: React.ComponentProps<'a'> & {
		isActive?: boolean
		isClientRouting?: boolean
		href: string
	},
	ref: ForwardedRef<HTMLAnchorElement>,
) {
	const pageContext = usePageContext()
	const customProps: Partial<React.ComponentProps<'a'>> = {}

	if (isClientRouting) {
		customProps.onClick = (event) => {
			event.preventDefault()

			navigate(props.href, {
				keepScrollPosition: true,
			})
		}
	}

	return (
		<a
			{...props}
			{...customProps}
			className={clsx('link', props.className, {
				'link-accent': pageContext.urlPathname === props.href || props.isActive,
			})}
			ref={ref}
		/>
	)
})
