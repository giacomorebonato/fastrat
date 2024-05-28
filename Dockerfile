FROM node:22 as build

RUN npm i pnpm@9 -g

WORKDIR /app

COPY ./ ./

ENV NODE_ENV development
RUN pnpm i --frozen-lockfile --prod=false
RUN node --run build
RUN pnpm prune --production --config.ignore-scripts=true
RUN rm -rf src
RUN rm -rf public

FROM node:22 as run

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["node", "--run", "start"]
