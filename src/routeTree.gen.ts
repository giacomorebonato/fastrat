import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as NotesNoteIdImport } from './routes/notes/$noteId'

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const NotesNoteIdRoute = NotesNoteIdImport.update({
  path: '/notes/$noteId',
  getParentRoute: () => rootRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/notes/$noteId': {
      preLoaderRoute: typeof NotesNoteIdImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([IndexRoute, NotesNoteIdRoute])
