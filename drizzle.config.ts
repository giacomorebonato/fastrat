import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.DATABASE_URL!,
	},
	schema: './src/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	verbose: true,
	strict: true,
})
