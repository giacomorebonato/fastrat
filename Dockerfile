FROM node:22 AS builder

RUN npm i pnpm -g

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile --prod=false

COPY . .

RUN pnpm build

RUN rm -rf src

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV production

EXPOSE 3000

CMD ["pnpm", "start"]
