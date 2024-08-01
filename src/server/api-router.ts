import { authApi } from '#/auth/auth-api'
import { noteApi } from '#/notes/note-api'
import { router } from './trpc-server'

export const apiRouter = router({
	auth: authApi,
	note: noteApi,
})

export type ApiRouter = typeof apiRouter
