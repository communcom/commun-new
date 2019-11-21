FROM node:12-alpine as builder

ENV IN_DOCKER=1
WORKDIR /app

RUN npm install --global yarn
RUN yarn global add lerna

COPY .npmrc .yarnrc package.json yarn.lock lerna.json ./

COPY packages/presets ./packages/presets
COPY packages/icons ./packages/icons
COPY packages/ui ./packages/ui
COPY packages/web ./packages/web

RUN yarn
RUN yarn bootstrap
RUN yarn build

FROM node:12-alpine

EXPOSE 3000
ENV NODE_ENV=production
ENV IN_DOCKER=1
WORKDIR /app

RUN npm install --global yarn

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/packages/ ./packages/

CMD ["yarn", "--cwd", "packages/web", "start:docker"]
