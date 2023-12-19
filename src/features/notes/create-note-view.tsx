import '@blocknote/core/style.css'
import { useRef } from 'react'
import { P, match } from 'ts-pattern'
import { trpcClient } from '#features/browser/trpc-client'
import { TextEditor } from './text-editor'

export function CreateNoteView(props: { id: string }) {
	const statusRef = useRef<HTMLSpanElement>(null)
	const getNote = trpcClient.note.get.useQuery({
		id: props.id,
	})

	return (
		<div className='p-4'>
			{match(getNote)
				.with({ isLoading: true }, () => <span>Loading</span>)
				.with({ data: P.not(undefined) }, () => (
					<TextEditor
						id={props.id}
						onChange={() => {
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							statusRef.current!.innerText! = 'Writing...'
						}}
						onSave={() => {
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
