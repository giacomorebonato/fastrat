import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/react-query'
import React, { useState } from 'react'
import './main.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { trpcClient } from '#features/browser/trpc-client'
import type { PageContext } from './types'
import 'react-toastify/dist/ReactToastify.css'
import { clsx } from 'clsx'
import { useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import superjson from 'superjson'

const contextClass = {
	dark: 'bg-white-600 font-gray-300',
	default: 'bg-primary',
	error: 'bg-red-600',
	info: 'bg-gray-600',
	success: 'bg-blue-600',
	warning: 'bg-orange-400',
} as const

export function PageShell({
	children,
	pageContext,
}: {
	children: React.ReactNode
	pageContext: PageContext
}) {
	const [queryClient] = useState(() => new QueryClient())
	const [apiClient] = useState(() =>
		trpcClient.createClient({
			links: [
				httpBatchLink({
					url: '/trpc',
				}),
			],
			transformer: superjson,
		}),
	)

	return (
		<React.StrictMode>
			<trpcClient.Provider client={apiClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Layout>
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
					</Layout>
					<ReactQueryDevtools buttonPosition='bottom-right' />
				</QueryClientProvider>
			</trpcClient.Provider>
		</React.StrictMode>
	)
}

function Layout({ children }: { children: React.ReactNode }) {
	const dialogRef = useRef<HTMLDialogElement | null>(null)

	return (
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

					<button
						className='btn btn-ghost'
						onClick={() => {
							dialogRef.current!.showModal()
						}}
						type='button'
					>
						Login
					</button>
				</div>
				{children}
			</div>
			<div className='drawer-side'>
				<label
					aria-label='close sidebar'
					className='drawer-overlay'
					htmlFor='my-drawer-3'
				/>
				<ul className='menu min-h-full w-80 bg-base-200 p-4'>
					<li>
						<a>Sidebar Item 1</a>
					</li>
					<li>
						<a>Sidebar Item 2</a>
					</li>
				</ul>
			</div>

			<dialog className='modal' id='my_modal_2' ref={dialogRef}>
				<div className='modal-box grid grid-cols-1'>
					<a href='/login/google'>Login with Google</a>
				</div>
				<form className='modal-backdrop' method='dialog'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	)
}
