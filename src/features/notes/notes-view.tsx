import { trpcClient } from '#features/browser/trpc-client'
import { Link } from '#features/browser/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ComponentType, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import { navigate } from 'vike/client/router'

export const NotesView = function NotesView() {
	const getNotes = trpcClient.note.list.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	})
	const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({})
	const deleteNote = trpcClient.note.delete.useMutation({
		onMutate(variables) {
			setLoadingIds({ ...loadingIds, [variables.id]: true })
		},
		onSuccess(variables) {
			setLoadingIds({ ...loadingIds, [variables.id]: false })
			getNotes.refetch()
			toast(`Deleted note ${variables.id}`)
		},
	})
	const upsertNote = trpcClient.note.upsert.useMutation({
		onSuccess(note) {
			navigate(`/notes/${note.id}`)
		},
	})

	const Row: ComponentType<ListChildComponentProps> = ({ index, style }) => {
		const [isDeleting, setIsDeleting] = useState(false)
		const note = getNotes.data![index]
		const linkRef = useRef<HTMLAnchorElement>()

		return (
			<motion.div className='pr-5' key={note.id} style={style}>
				<Link
					className={clsx(
						'link flex p-2 text-center !no-underline',
						'hover:link-hover hover:bg-accent-content hover:no-underline',
					)}
					href={`/notes/${note.id}`}
					isClientRouting
					ref={(ref) => {
						linkRef.current = ref!
					}}
				>
					<span className='flex-1'>
						{isDeleting ? (
							<span className='loading loading-dots loading-sm' />
						) : (
							note.title || 'Title not set'
						)}
					</span>

					<button
						className='btn btn-warning btn-sm no-underline hover:no-underline'
						disabled={loadingIds[note.id]}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setIsDeleting(true)
							setTimeout(() => {
								deleteNote.mutate({ id: note.id })
							}, 500)
						}}
					>
						Delete
					</button>
				</Link>
			</motion.div>
		)
	}

	return (
		<div
			className='grid grid-flow-row grid-cols-1 gap-1 p-2'
			style={{
				viewTransitionName: 'hero',
			}}
		>
			{getNotes.isLoading ? (
				<span className='loading loading-dots loading-sm' />
			) : (
				<button
					className='btn btn-secondary'
					onClick={() => {
						upsertNote.mutate({
							content: 'Write something',
							id: crypto.randomUUID(),
						})
					}}
				>
					Create Note
				</button>
			)}

			{getNotes.data && (
				<div className='h-[calc(100vh-128px)]'>
					<AutoSizer>
						{({ height, width }) => {
							return (
								<List
									height={height}
									itemCount={getNotes.data.length}
									itemSize={45}
									width={width}
								>
									{Row}
								</List>
							)
						}}
					</AutoSizer>
				</div>
			)}
		</div>
	)
}

function getContent(text?: string) {
	if (!text) {
		return undefined
	}
	try {
		return JSON.parse(text)
	} catch {
		// eslint-disable-next-line no-console
		// console.error(error)
	}

	return undefined
}
