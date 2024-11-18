import Fs from 'node:fs'
import Os from 'node:os'
import Path from 'node:path'
import { expect, test } from 'vitest'
import { createDb } from '#/db/db-plugin'
import { NoteQueries } from '#/db/note-queries'

test('creates, queries and deletes notes', async () => {
	const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'tmp-db'))
	const db = await createDb(`file:${Path.join(tmp, 'db.sqlite')}`)
	const noteQueries = new NoteQueries(db)

	expect(await noteQueries.list()).toHaveLength(0)

	noteQueries.upsert({ content: 'Hello', id: 'note-id' })

	expect(await noteQueries.list()).toHaveLength(1)

	noteQueries.delete('note-id')

	expect(await noteQueries.list()).toHaveLength(0)
})
