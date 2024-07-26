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

# Install LiteFS
RUN apt-get update && apt-get install -y ca-certificates fuse3 sqlite3
    
WORKDIR /app

COPY --from=build /app .
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Copy LiteFS config
COPY litefs.yml /etc/litefs.yml

# Create necessary directories for FUSE and set permissions
RUN mkdir -p /litefs /var/lib/litefs && \
    chown node:node /litefs /var/lib/litefs

EXPOSE 3000

# CMD ["node", "--run", "start"]
CMD litefs mount
