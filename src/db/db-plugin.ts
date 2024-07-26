import EventEmitter from 'node:events'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import Database from 'better-sqlite3'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { fastifyPlugin } from 'fastify-plugin'
import type TypedEmitter from 'typed-emitter'
import { type Queries, buildQueries } from './build-queries'
import * as schema from './schema'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type DbEvents = TypedEmitter<{}>

export function createDb(dbUrl: string) {
	const sqlite = new Database(dbUrl)

	sqlite.pragma('journal_mode = WAL')

	const db = drizzle(sqlite, { schema })

	migrate(db, { migrationsFolder: Path.join(appRootPath.path, 'migrations') })

	return db
}

export const dbPlugin = fastifyPlugin<{ dbUrl: string }>(
	(fastify, params, done) => {
		const db = createDb(params.dbUrl)

		fastify.db = db
		fastify.queries = buildQueries(db)
		fastify.dbEvents = new EventEmitter() as DbEvents

		done()
	},
	{
		name: 'db-plugin',
	},
)

export default dbPlugin

export type FastratDatabase = BetterSQLite3Database<typeof schema>

declare module 'fastify' {
	interface FastifyInstance {
		db: FastratDatabase
		dbEvents: DbEvents
		queries: Queries
	}
}
