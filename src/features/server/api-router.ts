import { authRouter } from '#features/auth/auth-routes'
import { noteRouter } from '#features/notes/note-routes'
import { router } from './trpc-server'

export const apiRouter = router({
	auth: authRouter,
	note: noteRouter,
})

export type ApiRouter = typeof apiRouter
