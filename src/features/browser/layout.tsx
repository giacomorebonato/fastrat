import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import clsx from 'clsx'
import { useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { P, match } from 'ts-pattern'
import './main.css'
import { trpcClient } from './trpc-client'

const contextClass = {
	dark: 'bg-white-600 font-gray-300',
	default: 'bg-primary',
	error: 'bg-red-600',
	info: 'bg-gray-600',
	success: 'bg-blue-600',
	warning: 'bg-orange-400',
} as const

export function Layout({ children }: { children: React.ReactNode }) {
	const dialogRef = useRef<HTMLDialogElement | null>(null)
	const utils = trpcClient.useUtils()
	const profile = trpcClient.auth.profile.useQuery()
	const logout = trpcClient.auth.logout.useMutation({
		onSuccess() {
			utils.auth.profile.reset()
		},
	})

	return (
		<>
			<div className='drawer'>
				<input className='drawer-toggle' id='my-drawer-3' type='checkbox' />
				<div className='drawer-content flex flex-col'>
					<div className='navbar w-full bg-base-300 pr-4'>
						<div className='flex-none'>
							<label
								aria-label='open sidebar'
								className='btn btn-square btn-ghost'
								htmlFor='my-drawer-3'
							>
								<svg
									className='inline-block h-6 w-6 stroke-current'
									fill='none'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<title>Hamburger menu</title>
									<path
										d='M4 6h16M4 12h16M4 18h16'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
									/>
								</svg>
							</label>
						</div>
						<a className='link mx-2 flex-1 px-2 no-underline' href='/'>
							FastRat
						</a>

						{match(profile.data)
							.with(null, () => (
								<button
									className='btn btn-ghost'
									data-testid='btn-login'
									onClick={() => {
										dialogRef.current?.showModal()
									}}
									type='button'
								>
									Login
								</button>
							))
							.with(P.not(undefined), () => (
								<button
									data-testid='btn-logout'
									type='button'
									className='btn btn-ghost'
									onClick={() => {
										logout.mutate()
									}}
								>
									Logout
								</button>
							))
							.otherwise(() => null)}
					</div>
					<main>{children}</main>
					<ToastContainer
						bodyClassName={() => 'text-sm font-white font-med block p-3'}
						position='bottom-right'
						toastClassName={(item) => {
							return clsx(
								contextClass[item?.type || 'default'],
								'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer my-2',
							)
						}}
					/>
				</div>
				<div className='drawer-side'>
					<label
						aria-label='close sidebar'
						className='drawer-overlay'
						htmlFor='my-drawer-3'
					/>
					<ul className='menu min-h-full w-80 bg-base-200 p-4'>
						<li>
							<a href='#test'>Sidebar Item 1</a>
						</li>
						<li>
							<a href='#test'>Sidebar Item 2</a>
						</li>
					</ul>
				</div>
			</div>
			<dialog className='modal' id='my_modal_2' ref={dialogRef}>
				<div className='modal-box grid grid-cols-1'>
					<a href='/login/google'>Login with Google</a>
				</div>
				<form method='dialog' className='modal-backdrop'>
					{/* biome-ignore lint/a11y/useButtonType: otherwise "close on click outside" doesn't work */}
					<button>close</button>
				</form>
			</dialog>

			<section className='devtools'>
				<ReactQueryDevtools buttonPosition='bottom-left' />
				<TanStackRouterDevtools position='bottom-right' />
			</section>
		</>
	)
}
