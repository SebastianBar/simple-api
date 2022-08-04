FROM node:18-alpine as builder
WORKDIR /app
COPY src ./src
COPY prisma ./prisma
COPY package.json tsconfig.json .
RUN npm install
RUN npm run build

FROM node:18-alpine as app
WORKDIR /app
USER node
COPY --chown=node:node tsconfig.json package.json .
COPY --chown=node:node prisma ./prisma
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

CMD ["node", "dist/index.js"]