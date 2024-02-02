import { env } from '#server/env'

export const USER_TOKEN =
	env.NODE_ENV === 'production' ? '__Host-userToken' : 'userToken'
