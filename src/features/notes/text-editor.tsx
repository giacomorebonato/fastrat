import '@blocknote/core/style.css'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useConstant } from '#features/browser/use-constant'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useEffect } from 'react'

export const TextEditor = (props: {
	id: string
	onChange: () => void
	onSave: () => void
}) => {
	const yDoc = useConstant(() => {
		return new Y.Doc()
	})
	const hocuspocus = useConstant(() => {
		const url = `${import.meta.env.PROD ? 'wss' : 'ws'}://${
			window.location.host
		}/collaboration/documents`

		return new HocuspocusProvider({
			document: yDoc,
			url,
			name: props.id,
			onConnect() {
				console.log(`${props.id} connected on websocket`)
			},
		})
	})
	const persistence = useConstant(
		() => new IndexeddbPersistence(props.id, yDoc),
	)

	useEffect(() => {
		persistence.on('sync', () => {
			console.log('synced')
		})
	}, [persistence])

	const editor = useBlockNote(
		{
			collaboration: {
				provider: hocuspocus,
				fragment: yDoc.getXmlFragment('document-store'),
				user: {
					name: 'Pippo',
					color: `#${getRandomColor()}`,
				},
			},
			onEditorReady(editor) {
				editor.focus()
			},
		},
		[props.id],
	)

	return <BlockNoteView className='mb-2' editor={editor} theme='dark' />
}

function getRandomColor() {
	return Math.floor(Math.random() * 16777215).toString(16)
}
