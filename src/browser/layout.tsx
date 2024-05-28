import { Link, useRouter } from '@tanstack/react-router'
import clsx from 'clsx'
import type React from 'react'
import { Suspense, lazy, useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { P, match } from 'ts-pattern'
import { trpcClient } from './trpc-client'

const contextClass = {
	dark: 'bg-white-600 font-gray-300',
	default: 'bg-primary',
	error: 'bg-red-600',
	info: 'bg-gray-600',
	success: 'bg-blue-600',
	warning: 'bg-orange-400',
} as const

let Devtools: React.FC = () => null

export function Layout({
	children,
	sidebar,
}: { children: React.ReactNode; sidebar?: React.ReactNode }) {
	const dialogRef = useRef<HTMLDialogElement | null>(null)
	const utils = trpcClient.useUtils()
	const profile = trpcClient.auth.profile.useQuery()
	const logout = trpcClient.auth.logout.useMutation({
		onSuccess() {
			utils.auth.profile.reset()
		},
	})
	const router = useRouter()
	const checboxRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const unsuscribe = router.history.subscribe(() => {
			if (checboxRef.current) {
				checboxRef.current.checked = false
			}
		})

		return () => {
			unsuscribe()
		}
	}, [router.history])

	useEffect(() => {
		if (import.meta.env.DEV && !import.meta.env.SSR) {
			Devtools = lazy(() => {
				return import('./devtools').then((c) => ({ default: c.Devtools }))
			})
		}
	})

	return (
		<>
			<div className='drawer lg:drawer-open'>
				<input
					className='drawer-toggle'
					id='my-drawer-3'
					type='checkbox'
					ref={checboxRef}
				/>
				<div className='drawer-content flex flex-col'>
					<div className='navbar w-full bg-base-300 pr-4'>
						<div className='flex-none'>
							<label
								aria-label='open sidebar'
								className='btn btn-square btn-ghost lg:hidden'
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

						<div className='flex-1 '>
							<Link
								className='link mx-2 px-2 no-underline hover:link-hover'
								to='/'
							>
								FastRat
							</Link>
							<a
								className='link no-underline hover:link-hover'
								href='https://github.com/giacomorebonato/fastrat'
								target='_blank'
								rel='noreferrer'
							>
								GitHub
							</a>
						</div>
						{match(profile.data)
							.with(null, () => (
								<button
									className='btn btn-ghost '
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
									className='btn btn-ghost '
									onClick={() => {
										logout.mutate()
									}}
								>
									Logout
								</button>
							))
							.otherwise(() => null)}
					</div>
					{children}
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
					{sidebar}
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

			<Suspense fallback={<div />}>
				<Devtools />
			</Suspense>
		</>
	)
}
