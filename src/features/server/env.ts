import process from 'node:process'
import 'dotenv/config'
import { number, z } from 'zod'

const schema = z.object({
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	HOST: z.string(),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	PORT: z.string().transform((value) => Number(value)),
	SECRET: z.string(),
	SITE_URL: z.string().default('http://localhost:3000'),
	TURSO_DB_AUTH_TOKEN: z.string(),
	TURSO_DB_URL: z.string(),
})

export const env = schema.parse(process.env)

export type Env = z.infer<typeof schema>
