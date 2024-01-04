# Fastify + React = FastRat!

<p align="center">
  <img 
    src="https://github.com/giacomorebonato/fastrat/blob/main/src/images/logo.jpg?raw=true" 
    alt="A rat on a skateboard"
    width='200'
    height='200'
  />
</p>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat&logo=Vitest&logoColor=white" alt="Vitest">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Lodash-3492FF.svg?style=flat&logo=Lodash&logoColor=white" alt="Lodash">

<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
<img src="https://img.shields.io/badge/GitHub-181717.svg?style=flat&logo=GitHub&logoColor=white" alt="GitHub">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Fastify-000000.svg?style=flat&logo=Fastify&logoColor=white" alt="Fastify">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
</p>

![license](https://img.shields.io/github/license/giacomorebonato/fastrat?style=flat&labelColor=E5E4E2&color=869BB3)
![repo-language-count](https://img.shields.io/github/languages/count/giacomorebonato/fastrat?style=flat&labelColor=E5E4E2&color=869BB3)
![repo-top-language](https://img.shields.io/github/languages/top/giacomorebonato/fastrat?style=flat&labelColor=E5E4E2&color=869BB3)
![last-commit](https://img.shields.io/github/last-commit/giacomorebonato/fastrat?style=flat&labelColor=E5E4E2&color=869BB3)
</div>

<details>
<summary>

### Based on these libraries

</summary>

* [Fastify](https://fastify.dev)
  * a fast well maintained web framework
* [Vite](https://vitejs.dev)
  * for frontend tooling and bundling
* [Vike](https://vike.dev)
  * a Vite plugin to create your own NextJS
* [tRPC](https://trpc.io/docs/server/adapters/fastify)
  * for end points with E2E type safety
* [Vavite](https://github.com/cyco130/vavite)
  * for running and compiling Node code with Vite
* [Turso db](https://turso.tech)
  * for easy to use SQL database
  * fallbacks to [libsql](https://github.com/tursodatabase/libsql) locally
* [Fly.io](https://fly.io)
  * for deployment

</details>

<details>

<summary open>

### Instructions

</summary>

1. Clone the repository 
   * `gh repo clone giacomorebonato/fastrat-test`
2. Install dependencies
   * `pnpm install`
3. Start the project
   * `pnpm dev`

</details>

<details>

<summary>

### Authentication

</summary>

Provide `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into the `.env` file to allow Google authentication ([instructions](https://www.balbooa.com/help/gridbox-documentation/integrations/other/google-client-id)).  
You can check how authentication is achieved in [src/features/auth/google-auth.ts](src/features/auth/google-auth.ts) by leveraging [fastify-oauth2](https://github.com/fastify/fastify-oauth2).  
It should be easy for you to re-use this example to add other authentication providers.

</details>

<details>

<summary>

### SSR

</summary>

Project starts with pre-rendering enabled. Meaning that React components are rendered at build time and not when a request comes in.  
Check the answer to the question "Should I pre-render?" on [Vike docs](https://vike.dev/pre-rendering#should-i-pre-render).

Vike gives you total control around this behaviour and it's well documented.

</details>


<details>

<summary>

### tRPC

</summary>

This project comes with [tRPC](https://trpc.io) ready to be used.
Check [note-router.ts](src/features/notes/note-router.ts) to see how queries, mutations and subscriptions can be implemented.  
All the routers are collected in [api-router.ts](src/features/server/api-router.ts), but you can organise files in the way you prefer.

</details>

<details>

<summary>

### Deploy

</summary>

* This website deploys automatically to Fly.io
  * https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/
  * [GitHub action](.github/workflows/fly.yml)
* [Environment variables](src/features/server/env.ts)
  * https://fly.io/docs/rails/the-basics/configuration/
  * [fly.toml](fly.toml)

</details>

## Credits

This project has been inspired by other starter kit

- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [epic-stack](https://github.com/epicweb-dev/epic-stack)
