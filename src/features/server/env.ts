import process from 'node:process'
import { z } from 'zod'
import 'dotenv/config'

const schema = z.object({
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	SECRET: z.string(),
	SITE_URL: z.string().default('http://localhost:3000'),
})

export const env = schema.parse(process.env)

export type Env = z.infer<typeof schema>
