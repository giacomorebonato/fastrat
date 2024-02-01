import { Link } from '@tanstack/react-router'
import { useCallback } from 'react'

const SmoothLink = ({ children, href }: { children: string; href: string }) => {
	const smoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		const link = e.target as HTMLAnchorElement
		const destination = link.href.split('#').at(-1)

		if (!destination) {
			return
		}

		const titleElement = document.getElementById(destination)

		if (titleElement) {
			// biome-ignore lint/style/noNonNullAssertion: needs to be done in a better React way
			;(document.getElementById('my-drawer-3')! as HTMLInputElement).checked =
				false
			titleElement.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}, [])

	return (
		// biome-ignore lint/a11y/useValidAnchor: <explanation>
		<a href={href} onClick={smoothScroll}>
			{children}
		</a>
	)
}

export const SideMenu = () => {
	return (
		<ul
			className='menu bg-base-200 w-56 rounded-box h-full font-cardo'
			role='navigation'
		>
			<li>
				<h2 className='menu-title'>Content</h2>
				<ul>
					<li>
						{}
						<SmoothLink href='#why-fastrat'>Why FastRat?</SmoothLink>
					</li>
					<li>
						<SmoothLink href='#spa-or-mpa'>SPA or MPA</SmoothLink>
					</li>
					<li>
						<SmoothLink href='#great-dx'>Great DX</SmoothLink>
					</li>
					<li>
						<SmoothLink href='#fully-typed'>Fully typed</SmoothLink>
					</li>
				</ul>
			</li>
			<li>
				<h2 className='menu-title'>Demo Apps</h2>
				<ul>
					<li>
						<Link to='/notes'>Note taking</Link>
					</li>
				</ul>
			</li>
		</ul>
	)
}
