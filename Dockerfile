FROM node:22 AS builder

RUN npm i pnpm@9 -g

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile --prod=false

COPY . .

RUN node --run build

RUN rm -rf src

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "--run", "start"]
