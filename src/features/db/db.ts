import Path from 'node:path'
import { createClient } from '@libsql/client'
import { env } from '#features/server/env'
import appRootPath from 'app-root-path'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

const client = createClient({
	authToken: env.TURSO_DB_AUTH_TOKEN,
	url: env.TURSO_DB_URL,
})

export const db = drizzle(client)

migrate(db, { migrationsFolder: Path.join(appRootPath.path, 'drizzle') })
