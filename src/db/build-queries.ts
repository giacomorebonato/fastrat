import type { FastratDatabase } from './db-plugin'
import { NoteQueries } from './note-queries'
import { SessionQueries } from './session-queries'
import { UserQueries } from './user-queries'

export function buildQueries(db: FastratDatabase) {
	return {
		note: new NoteQueries(db),
		session: new SessionQueries(db),
		user: new UserQueries(db),
	}
}

export type Queries = ReturnType<typeof buildQueries>
