import { CollabQueries } from './collab-queries'
import type { DbEvents, FastratDatabase } from './db-plugin'
import { NoteQueries } from './note-queries'
import { SessionQueries } from './session-queries'
import { UserQueries } from './user-queries'

export function buildQueries(db: FastratDatabase, dbEvents: DbEvents) {
	return {
		collab: new CollabQueries(db, dbEvents),
		note: new NoteQueries(db),
		session: new SessionQueries(db),
		user: new UserQueries(db),
	}
}

export type Queries = ReturnType<typeof buildQueries>
