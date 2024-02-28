# Fastify + React = FastRat! <!-- omit from toc -->

<p align="center">
  <img 
    src="https://github.com/giacomorebonato/fastrat/blob/main/src/images/logo.jpg?raw=true" 
    alt="A rat on a skateboard"
    width='200'
    height='200'
  />
</p>

## Quickstart <!-- omit from toc -->

```bash
gh repo clone giacomorebonato/fastrat-test # clone the repository
pnpm install # install dependencies
pnpm dev     # start the project in dev mode
```

To enable authentication and a production database, rename `.env.example` to `.env` and fill the fields properly.  
In a production environment, you should set those environment variables directly.

[Example with Fly.io](https://fly.io/docs/reference/secrets/)

```bash
fly secrets set TURSO_DB_URL=libsql://link-to-your-turso-db.turso.io
```


- [Authentication](#authentication)
- [SSR and Routing](#ssr-and-routing)
- [tRPC](#trpc)
- [Server side data fetching](#server-side-data-fetching)
- [Testing](#testing)
- [Deploy](#deploy)
- [Credits](#credits)

## Based on these libraries <!-- omit from toc -->

* [Fastify](https://fastify.dev): a fast well maintained web framework
* [Vite](https://vitejs.dev): for frontend tooling and bundling
* [tRPC](https://trpc.io/docs/server/adapters/fastify): for end points with E2E type safety
* [Tanstack Router](https://tanstack.com/router/latest): for filesystem based routes with type safety
* [Vavite](https://github.com/cyco130/vavite): use Vite to compile and bundle both client and server code
* [Turso db](https://turso.tech): SQLite database which fallbacks to [libsql](https://github.com/tursodatabase/libsql) locally
* [Fly.io](https://fly.io): for deployment


Thanks to Vavite, any change to frontend or backend code will be reflected immediately, without manually restarting the server.

## Authentication

Provide `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into the `.env` file to allow Google authentication ([instructions](https://www.balbooa.com/help/gridbox-documentation/integrations/other/google-client-id)).  
You can check how authentication is achieved in [src/features/auth/google-auth.ts](src/auth/google-auth.ts) by leveraging [fastify-oauth2](https://github.com/fastify/fastify-oauth2).  
It should be easy for you to re-use this example to add other authentication providers.


## SSR and Routing

SSR is achieved by following [Tanstack router examples](https://github.com/TanStack/router/tree/main/examples/react/basic-ssr-streaming-file-based).
The page content is streamed and meta tags in `<head />` are rendered following [react-helmet-async examples](https://github.com/staylor/react-helmet-async?tab=readme-ov-file#streams).


## tRPC

This project comes with [tRPC](https://trpc.io) ready to be used.
Check [note-router.ts](src/notes/note-router.ts) to see how queries, mutations and subscriptions can be implemented.  
All the routers are collected in [api-router.ts](src/server/api-router.ts), but you can organise files in the way you prefer.

## Server side data fetching

Server side data fetching is needed if you want to render HTML on server side (for SEO for example).  
It happens in the [route loader function](src/routes/notes/$noteId.tsx) defined in Tanstack router.  
As in the link you have to be mindful that the loader runs both server and client side, hence you should guard dynamic server only import inside of the `if (import.meta.env.SSR)` condition.  
You can then assign the fetched data to React-Query `initialData` parameter, like this:

```typescript
const loaderData = Route.useLoaderData()

const noteQuery = trpcClient.note.get.useQuery(
  { id: noteId },
  {
    initialData: loaderData?.note,
  },
)
```

With this practice we ensure that:

* HTML is rendered if the page is accessed through server side routing
* a request is made to fetch data if the page is accessed through client side routing

This probably looks less magical than `getServerSideProps`, but still gives you full control over the rendering process.

## Testing

This starter contains a few unit tests and an E2E test.

```bash
pnpm test        # uses Vitest to run unit tests
pnpm e2e         # uses PlayWright to run E2E tests
pnpm e2e:headed  # uses PlayWright to run E2E tests opening the browser
```

The present E2E tests verify that the page is server rendered and that websockets are working.


## Deploy

You can deploy FastRat everywhere Docker runs.

* This website deploys automatically to Fly.io
  * https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/
  * [GitHub action](.github/workflows/fly.yml)
* [Environment variables](src/features/server/env.ts)
  * https://fly.io/docs/rails/the-basics/configuration/
  * [fly.toml](fly.toml)

## Credits

This project has been inspired by other starter kits:

- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [epic-stack](https://github.com/epicweb-dev/epic-stack)
