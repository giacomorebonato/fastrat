import { useCallback, useEffect } from 'react'
import { P, match } from 'ts-pattern'
import { trpcClient } from '#features/browser/trpc-client'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { navigate } from 'vike/client/router'

export function CreateNoteInput(props: { id: string }) {
	const getNote = trpcClient.note.get.useQuery(
		{
			id: props.id,
		},
		{
			retry: 0,
		},
	)
	const upsertNote = trpcClient.note.upsert.useMutation({
		onError(error) {
			toast(error.message)
		},
	})
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const debouncedUpsert = useCallback(
		_.debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (getNote.data) {
				upsertNote.mutate({ ...getNote.data, content: e.target.value })
			}
		}, 500),
		[getNote?.data],
	)

	useEffect(() => {
		if (getNote.error) {
			toast(getNote.error.message)
			navigate('/')
		}
	}, [getNote.error])

	return (
		<div className='p-4'>
			{match(getNote)
				.with({ isLoading: true }, () => {
					return <span>Loading...</span>
				})
				.with({ data: P.not(null) }, () => {
					return (
						<textarea
							className='textarea textarea-bordered w-full'
							defaultValue={getNote.data?.content}
							onChange={debouncedUpsert}
						/>
					)
				})
				.otherwise(() => null)}
		</div>
	)
}
