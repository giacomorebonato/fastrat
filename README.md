# Fastify + React = FastRat! <!-- omit from toc -->

<p align="center">
  <img 
    src="https://github.com/giacomorebonato/fastrat/blob/main/src/images/logo.jpg?raw=true" 
    alt="A rat on a skateboard"
    width='200'
    height='200'
  />
</p>

- [Based on these libraries](#based-on-these-libraries)
- [Instructions for development](#instructions-for-development)
- [Authentication](#authentication)
- [SSR](#ssr)
- [tRPC](#trpc)
- [Deploy](#deploy)
- [Credits](#credits)

## Based on these libraries

* [Fastify](https://fastify.dev): a fast well maintained web framework
* [Vite](https://vitejs.dev): for frontend tooling and bundling
* [Vike](https://vike.dev): a Vite plugin for creating your own NextJS
* [tRPC](https://trpc.io/docs/server/adapters/fastify): for end points with E2E type safety
* [Vavite](https://github.com/cyco130/vavite): for running and compiling Node code with Vite
* [Turso db](https://turso.tech): SQLite database which fallbacks to [libsql](https://github.com/tursodatabase/libsql) locally
* [Fly.io](https://fly.io): for deployment

## Instructions for development

```bash
gh repo clone giacomorebonato/fastrat-test # clone the repository
pnpm install # install dependencies
pnpm dev # start the project in dev mode
```

Thanks to Vavite, any change to frontend or backend code will be reflected immediately, without manually restarting the server.

## Authentication

Provide `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into the `.env` file to allow Google authentication ([instructions](https://www.balbooa.com/help/gridbox-documentation/integrations/other/google-client-id)).  
You can check how authentication is achieved in [src/features/auth/google-auth.ts](src/features/auth/google-auth.ts) by leveraging [fastify-oauth2](https://github.com/fastify/fastify-oauth2).  
It should be easy for you to re-use this example to add other authentication providers.


## SSR

Project starts with [pre-rendering enabled](vite.config.ts#L26). Meaning that React components are rendered at build time and not when a request comes in.  
Check the answer to the question "Should I pre-render?" on [Vike docs](https://vike.dev/pre-rendering#should-i-pre-render).

Vike gives you total control around this behaviour and it's well documented.

## tRPC

This project comes with [tRPC](https://trpc.io) ready to be used.
Check [note-router.ts](src/features/notes/note-router.ts) to see how queries, mutations and subscriptions can be implemented.  
All the routers are collected in [api-router.ts](src/features/server/api-router.ts), but you can organise files in the way you prefer.

## Deploy

* This website deploys automatically to Fly.io
  * https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/
  * [GitHub action](.github/workflows/fly.yml)
* [Environment variables](src/features/server/env.ts)
  * https://fly.io/docs/rails/the-basics/configuration/
  * [fly.toml](fly.toml)

## Credits

This project has been inspired by other starter kit

- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [epic-stack](https://github.com/epicweb-dev/epic-stack)
