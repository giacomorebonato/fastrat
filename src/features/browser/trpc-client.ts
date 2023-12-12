import { createTRPCReact } from '@trpc/react-query'
import type { ApiRouter } from '../server/api-router.js'

export const trpcClient = createTRPCReact<ApiRouter>()
