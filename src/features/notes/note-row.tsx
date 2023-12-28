import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from '#features/browser/link'
import { trpcClient } from '#features/browser/trpc-client'
import { NoteSelect } from './note-schema'

export const NoteRow = ({ note }: { note: NoteSelect }) => {
	const getNotes = trpcClient.note.list.useQuery()
	const [isDeleting, setIsDeleting] = useState(false)
	const deleteNote = trpcClient.note.delete.useMutation({
		onMutate(variables) {
			setIsDeleting(true)
		},
		onSuccess(data) {
			getNotes.refetch()
			setIsDeleting(false)
			toast(`Deleted note ${data.id}`)
		},
		onError(error) {
			setIsDeleting(false)
			toast(error.message)
		},
	})
	const linkRef = useRef<HTMLAnchorElement>()

	return (
		<motion.div key={note.id}>
			<Link
				className={clsx(
					'link flex p-2 text-center !no-underline',
					'hover:link-hover hover:bg-accent-content hover:no-underline',
				)}
				href={`/notes/${note.id}`}
				isClientRouting
				ref={(ref) => {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					linkRef.current = ref!
				}}
			>
				<span className='flex-1'>
					{isDeleting ? (
						<span className='loading loading-dots loading-sm' />
					) : (
						note.content.substring(0, 20)
					)}
				</span>

				<button
					type='button'
					className='btn btn-warning btn-sm no-underline hover:no-underline'
					disabled={isDeleting}
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
