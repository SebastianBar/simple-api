FROM node:18-alpine as build-deps
WORKDIR /app
COPY package.json .
RUN npm install

FROM build-deps as prd-deps
WORKDIR /app
RUN npm install --omit=dev

FROM build-deps as builder
WORKDIR /app
COPY src ./src
COPY tsconfig.json .
RUN npm run build

FROM node:18-alpine as app
WORKDIR /app
USER node
COPY --chown=node:node tsconfig.json package.json .
COPY --from=prd-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

CMD ["node", "dist/index.js"]