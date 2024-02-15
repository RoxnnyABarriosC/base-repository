FROM node:20-alpine as deps

WORKDIR /app

RUN chmod -R 777 /app

RUN apk add bash dumb-init curl
RUN curl -s https://raw.githubusercontent.com/Intervox/node-webp/latest/bin/install_webp | bash
RUN apk add --no-cache --update libwebp-tools
RUN apk add --no-cache --update libpng-dev libjpeg-turbo-dev giflib-dev tiff-dev autoconf automake make gcc g++ wget python3
RUN wget --no-check-certificate https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.0.0.tar.gz && \
      tar -xvzf libwebp-1.0.0.tar.gz && \
      cd libwebp-1.0.0 && \
      ./configure && \
      make && \
      make install && \
      cd .. && \
      rm -rf libwebp-1.0.0 libwebp-1.0.0.tar.gz

RUN npm install --location=global pnpm vitest

COPY --chown=node:node . .

ARG PORT

EXPOSE ${PORT}

EXPOSE 9228

FROM deps as builder

USER root

RUN pnpm i

RUN mkdir /app/dist
RUN chown -R node:node /app/dist

USER node

RUN pnpm build

FROM builder as prerelease

USER root

RUN rm -rf node_modules

RUN pnpm i --frozen-lockfile --prod

FROM node:18-alpine as prod

ENV NODE_ENV production

WORKDIR /app

RUN apk add bash dumb-init
RUN npm install -g pm2

COPY --from=prerelease --chown=node:node /app/package.json /app/pnpm-lock.yaml ./
COPY --from=prerelease --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=prerelease --chown=node:node /app/dist/ ./dist/
COPY --chown=node:node .env ecosystem.config.js usersfile super-admin-data.json ./

RUN mkdir .logs

RUN chmod 777 .logs

USER node

ENTRYPOINT ["dumb-init", "pm2-runtime", "start", "ecosystem.config.js"]

ARG PORT

EXPOSE ${PORT}

FROM deps as doc

RUN pnpm i -D unplugin-swc

RUN pnpm test:cov

ENTRYPOINT [ "dumb-init", "pnpm", "start:doc" ]

FROM deps as dev

USER node

# Run development server
ENTRYPOINT [ "dumb-init", "pnpm", "start:dev:check" ]
