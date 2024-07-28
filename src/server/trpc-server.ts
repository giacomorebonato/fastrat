import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { createTrpcContext } from './trpc-context'

const t = initTRPC.context<ReturnType<typeof createTrpcContext>>().create({
	transformer: superjson,
})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
