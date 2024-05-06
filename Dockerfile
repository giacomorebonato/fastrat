FROM node:22

RUN npm i pnpm@9 -g

WORKDIR /app

COPY ./ ./

ENV NODE_ENV development
RUN pnpm i --frozen-lockfile --prod=false
RUN pnpm build
RUN pnpm prune --production --config.ignore-scripts=true
RUN rm -rf src

EXPOSE 3000

ENV NODE_ENV production

CMD ["pnpm", "start"]
