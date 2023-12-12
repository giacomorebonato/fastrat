import { noteRouter } from '#features/notes/note-routes'
import { router } from './trpc-server'

export const apiRouter = router({
	note: noteRouter,
})

export type ApiRouter = typeof apiRouter
