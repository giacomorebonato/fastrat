# Fastify + React = FastRat!

<p align="center">
  <img 
    src="https://github.com/giacomorebonato/fastrat/blob/main/src/images/logo.jpg?raw=true" 
    alt="A rat on a skateboard"
    width='200'
    height='200'
  />
</p>

FastRat is a Fastify + React starter kit focusing on:

1. a nice developer experience 
2. easily switch from SPA and MPA, to leverage the best of both

<details>
<summary>

## All the libraries and technologies used

</summary>

* [Fastify](https://fastify.dev)
  * a fast well maintained web framework
* [Vite](https://vitejs.dev)
  * for frontend tooling and bundling
* [Vike](https://vike.dev)
  * a Vite plugin to create your own NextJS
* [Trpc](https://trpc.io/docs/server/adapters/fastify)
  * for end points with E2E type safety
* [Vavite](https://github.com/cyco130/vavite)
  * for running and compiling Node code with Vite
* [Turso db](https://turso.tech)
  * for easy to use SQL database
* [Fly.io](https://fly.io)
  * for deployment

</details>

<details>

<summary open>

## Instructions

</summary>

1. Clone the repository 
   * `gh repo clone giacomorebonato/fastrat-test`
2. Install dependencies
   * `pnpm install`
3. Set `.env` file
   * `cp .env.example .env`
4. Start the project
   * `pnpm dev`

</details>

<details>

<summary>

## Authentication

</summary>

Provide `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into the `.env` file to allow Google authentication ([instructions](https://www.balbooa.com/help/gridbox-documentation/integrations/other/google-client-id)).  
You can check how authentication is achieved in [src/features/auth/google-auth.ts](src/features/auth/google-auth.ts) by leveraging [fastify-oauth2](https://github.com/fastify/fastify-oauth2).  
It should be easy for you to re-use this example to add other authentication providers.

</details>

<details>

<summary>

## SSR

</summary>

Project starts with pre-rendering enabled. Meaning that React components are rendered at build time and not when a request comes in.
Check the answer to the question "Should I pre-render?" on [Vike docs](https://vike.dev/pre-rendering#should-i-pre-render).

Vike gives you total control around this behaviour and it's well documented.

</details>


<details>

<summary>

## tRPC

</summary>

This project comes with [tRPC](https://trpc.io) ready to be used.
Check [note-router.ts](src/features/notes/note-router.ts) to see how queries, mutations and subscriptions can be implemented.  
All the routers are collected in [api-router.ts](src/features/server/api-router.ts), but you can organise files in the way you prefer.

<details>

## Credits

This project has been inspired by other starter kit

- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [epic-stack](https://github.com/epicweb-dev/epic-stack)
