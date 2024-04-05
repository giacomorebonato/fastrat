import { env } from '#/server/env'

export const USER_TOKEN =
	env.NODE_ENV === 'production' && !env.CI ? '__Host-userToken' : 'userToken'
