import process from 'node:process'
import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
	CI: z
		.string()
		.default('false')
		.transform((value) => value === 'true'),
	GOOGLE_CLIENT_ID: z.string().default('fake-client-id'),
	GOOGLE_CLIENT_SECRET: z.string().default('fake-client-secret'),
	HOST: z.string().default('0.0.0.0'),
	HOST_NAMES_REDIRECT_FROM: z
		.string()
		.transform((text) => text.split(','))
		.default(''),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	PORT: z.string().transform(Number).default('3000'),
	SECRET: z.string().default('a-good-repository-secret'),
	SITE_URL: z.string().default('http://localhost:3000'),
	TEST_EMAIL: z.string().default('fastrat@email.com'),
	TURSO_DB_AUTH_TOKEN: z.optional(z.string()),
	TURSO_DB_URL: z.string().default('file:local.db'),
})

export const env = schema.parse(process.env)

export type Env = z.infer<typeof schema>
