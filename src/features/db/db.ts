import Path from 'node:path'
import appRootPath from 'app-root-path'
import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

export const sqliteDb = new Database('sqlite.db')

export const db: BetterSQLite3Database = drizzle(sqliteDb)

migrate(db, { migrationsFolder: Path.join(appRootPath.path, 'drizzle') })
