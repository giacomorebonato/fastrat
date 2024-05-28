import debounce from 'debounce'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { P, match } from 'ts-pattern'
import { trpcClient } from '#/browser/trpc-client'
import type { NoteRecord } from '#/db/note-table'

export function NoteTextarea(props: {
	note?: NoteRecord
}) {
	const [editedContent, setEditedContent] = useState<null | string>(null)
	const upsertNote = trpcClient.note.upsert.useMutation({
		onError(error) {
			toast(error.message)
		},
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const debouncedUpsert = useCallback(
		debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (props.note) {
				upsertNote.mutate({ ...props.note, content: e.target.value })
			}
		}, 500),
		[props.note],
	)

	return (
		<form className='p-4' onChange={() => {}}>
			{match(props.note)
				.with(P.not(undefined), () => (
					<textarea
						className='textarea textarea-bordered w-full'
						value={editedContent ?? props.note?.content}
						onChange={(e) => {
							setEditedContent(e.target.value)
							debouncedUpsert(e)
						}}
					/>
				))
				.otherwise(() => (
					<textarea
						className='textarea textarea-bordered w-full'
						value={'Loading...'}
						disabled
					/>
				))}
		</form>
	)
}
