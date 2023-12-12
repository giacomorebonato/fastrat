import Path from 'node:path'
import Root from 'app-root-path'
import type { Config } from 'drizzle-kit'

export default {
	schema: Path.join(Root.path, 'src', 'features', 'db', 'schema.ts'),
	driver: 'better-sqlite',
	out: './drizzle',
} satisfies Config
