import '@blocknote/core/style.css'
import { type BlockNoteEditor } from '@blocknote/core'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import { useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '#features/browser/trpc-client'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { match, P } from 'ts-pattern'

const getContent = (text?: string) => {
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

const BlockNoteText = (props: {
	content?: string
	id: string
	onChange: () => void
	onSave: () => void
}) => {
	const queryClient = useQueryClient()
	const upsertNote = trpcClient.note.upsert.useMutation({
		onSuccess(data) {
			props.onSave()

			// updates note list cache
			queryClient.setQueryData(
				[['note', 'list'], { type: 'query' }],
				(oldData: (typeof data)[]) => {
					return oldData.map((item) => {
						if (item.id === data.id) {
							return data
						}

						return { ...item }
					})
				},
			)
		},
	})
	const [newContent, setNewContent] = useState({
		content: '',
		edited: false,
		title: '',
	})
	const [, cancel] = useDebounce(
		() => {
			if (newContent.edited) {
				upsertNote.mutate({
					content: newContent.content,
					id: props.id,
					title: newContent.title,
				})
			}
		},
		1000,
		[newContent],
	)
	useEffect(() => {
		cancel()
	}, [props.id, cancel])

	const editor: BlockNoteEditor = useBlockNote(
		{
			initialContent: getContent(props.content),
			onEditorContentChange(editor) {
				props.onChange()
				editor.blocksToMarkdownLossy().then((text) => {
					setNewContent({
						content: JSON.stringify(editor.topLevelBlocks),
						edited: true,
						title: text.slice(0, 20).trim(),
					})
				})
			},
			onEditorReady(editor) {
				editor.focus()
			},
		},
		[props.id, props.content],
	)

	return <BlockNoteView className='mb-2' editor={editor} theme='dark' />
}

export function CreateNoteView(props: { id: string }) {
	const statusRef = useRef<HTMLSpanElement>(null)
	const getNote = trpcClient.note.get.useQuery({
		id: props.id,
	})

	console.log(`props.id: ${props.id}`)

	return (
		<div className='p-4'>
			{match(getNote)
				.with({ isLoading: true }, () => <span>Loading</span>)
				.with({ data: P.not(undefined) }, () => (
					<BlockNoteText
						content={getNote.data!.content ?? ''}
						id={props.id}
						onChange={() => {
							statusRef.current!.innerText! = 'Writing...'
						}}
						onSave={() => {
							statusRef.current!.innerText! = 'Saved'
						}}
					/>
				))
				.otherwise(() => null)}

			<div className='text-end'>
				<span ref={statusRef} />
			</div>
		</div>
	)
}
