import { expect, test } from 'vitest'
import { createDb } from '#/db/db-plugin'
import { NoteQueries } from '#/notes/note-queries'

test('creates, queries and deletes notes', () => {
	const db = createDb(':memory:')
	const noteQueries = new NoteQueries(db)

	expect(noteQueries.list()).toHaveLength(0)

	noteQueries.upsert({ content: 'Hello', id: 'note-id' })

	expect(noteQueries.list()).toHaveLength(1)

	noteQueries.delete('note-id')

	expect(noteQueries.list()).toHaveLength(0)
})
