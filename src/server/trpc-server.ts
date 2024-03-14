import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { createContext } from './trpc-context'

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
