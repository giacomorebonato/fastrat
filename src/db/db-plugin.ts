import EventEmitter from 'node:events'
import Path from 'node:path'
import appRootPath from 'app-root-path'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { fastifyPlugin } from 'fastify-plugin'
import type TypedEmitter from 'typed-emitter'
import { type Queries, buildQueries } from './build-queries'
import type { CollabSchema } from './collab-table'
import type * as schema from './schema'

export type DbEvents = TypedEmitter<{
	UPSERT_COLLAB: (entry: CollabSchema) => void
}>

export function createDb(dbUrl: string, authToken?: string) {
	const db = drizzle<typeof schema>({
		connection: {
			url: dbUrl,
			authToken,
		},
	})

	migrate(db, { migrationsFolder: Path.join(appRootPath.path, 'migrations') })

	return db
}

export const dbPlugin = fastifyPlugin<{ dbUrl: string }>(
	(fastify, params, done) => {
		const db = createDb(params.dbUrl)
		const dbEvents = new EventEmitter() as DbEvents

		fastify.db = db
		fastify.queries = buildQueries(db, dbEvents)
		fastify.dbEvents = dbEvents

		done()
	},
	{
		name: 'db-plugin',
	},
)

export default dbPlugin

export type FastratDatabase = ReturnType<typeof createDb>

declare module 'fastify' {
	interface FastifyInstance {
		db: FastratDatabase
		dbEvents: DbEvents
		queries: Queries
	}
}
