import { UserQueries } from '#/auth/user-queries'
import { NoteQueries } from '#/notes/note-queries'
import type { FastratDatabase } from './db-plugin'

export function buildQueries(db: FastratDatabase) {
	return {
		note: new NoteQueries(db),
		user: new UserQueries(db),
	}
}

export type Queries = ReturnType<typeof buildQueries>
