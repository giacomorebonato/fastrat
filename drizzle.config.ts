import Path from 'node:path'
import Root from 'app-root-path'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.TURSO_DB_URL!,
		authToken: process.env.TURSO_DB_AUTH_TOKEN,
	},
	schema: Path.join(Root.path, 'src', 'db', 'schema.ts'),
	driver: 'turso',
	out: './migrations',
	dialect: 'sqlite',
})
