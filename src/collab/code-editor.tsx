import { HocuspocusProvider } from '@hocuspocus/provider'
import Editor from '@monaco-editor/react'
import { getContrast } from 'color2k'
import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { IndexeddbPersistence } from 'y-indexeddb'
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs'

type AwarenessState = {
	clientId: string
	user: {
		nickname: string
		color: string
		contrastingColor: string
	}
}

export function CodeEditor(props: { docId?: string }) {
	const providerRef = useRef<HocuspocusProvider>()
	const docId = props.docId ?? 'example-document'

	useEffect(() => {
		return () => {
			providerRef.current?.disconnect()
		}
	}, [])

	useEffect(() => {
		if (providerRef.current) {
			const color = getRandomColor()
			providerRef.current.setAwarenessField('user', {
				nickname: 'Fake user',
				contrastingColor: getContrastingColor(color),
				color,
			})
		}
	}, [])

	return (
		<Editor
			height='500px'
			defaultLanguage='markdown'
			defaultValue='// some comment'
			theme='vs-dark'
			onMount={async (editor) => {
				const ydoc = new Y.Doc()
				const persistence = new IndexeddbPersistence(docId, ydoc)

				persistence.on('synced', () => {
					toast('Content from Indexeddb is loaded', {
						autoClose: 500,
						position: 'bottom-right',
					})
				})
				const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
				const origin = window.location.origin.replace(
					window.location.protocol,
					'',
				)

				const hpProvider = new HocuspocusProvider({
					url: `${protocol}:${origin}/collab/${docId}`,
					name: docId,
					document: ydoc,
					onConnect() {
						toast(`CRDT connected`)
						const color = getRandomColor()

						hpProvider.setAwarenessField('user', {
							nickname: 'Fake user',
							contrastingColor: getContrastingColor(color),
							color,
						})
					},
				})

				const type = ydoc.getText('monaco')
				const model = editor.getModel()

				if (model) {
					new MonacoBinding(
						type,
						model,
						new Set([editor]),
						hpProvider.awareness,
					)
				}

				hpProvider.on(
					'awarenessUpdate',
					({
						states,
					}: {
						states: AwarenessState[]
					}) => {
						console.log(states)
						for (const state of states) {
							if (!state.user?.color) {
								continue
							}

							createDynamicClass(
								`.yRemoteSelectionHead-${state.clientId}`,
								`border: 1px solid ${state.user.color};`,
							)
							createDynamicClass(
								`.yRemoteSelectionHead-${state.clientId}:hover::after`,
								`content: '${state.user.nickname}';
								cursor: pointer;
								padding: 4px;
								color: ${state.user.contrastingColor}
								background-color: ${state.user.color};`,
							)
						}
					},
				)

				providerRef.current = hpProvider
			}}
		/>
	)
}

function createDynamicClass(className: string, styles: string) {
	const styleElement = document.createElement('style')
	const rule = `${className} { ${styles} }`
	styleElement.textContent = rule
	document.head.appendChild(styleElement)
}

function getContrastingColor(hexColor: string) {
	const blackContrast = getContrast(hexColor, '#000000')
	const whiteContrast = getContrast(hexColor, '#FFFFFF')

	return blackContrast > whiteContrast ? '#000000' : '#FFFFFF'
}

function getRandomColor() {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

export default CodeEditor
