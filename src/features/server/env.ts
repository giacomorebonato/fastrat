import process from 'node:process'
import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
	CI: z.optional(z.boolean()),
	GOOGLE_CLIENT_ID: z.optional(z.string()),
	GOOGLE_CLIENT_SECRET: z.optional(z.string()),
	HOST: z.string(),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	PORT: z
		.string()
		.transform((value) => Number(value))
		.default('3000'),
	SECRET: z.string(),
	SITE_URL: z.string().default('http://localhost:3000'),
	TEST_EMAIL: z.optional(z.string()),
	TEST_PASSWORD: z.optional(z.string()),
	TURSO_DB_AUTH_TOKEN: z.optional(z.string()),
	TURSO_DB_URL: z.string().default('file:local.db'),
})

export const env = schema.parse(process.env)

export type Env = z.infer<typeof schema>
