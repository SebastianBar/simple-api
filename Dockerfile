FROM node:18-alpine as builder
WORKDIR /app
COPY src ./src
COPY prisma ./prisma
COPY package.json tsconfig.json .
RUN npm install
RUN npm run build

FROM node:18-alpine as app
WORKDIR /app
COPY tsconfig.json package.json .
COPY prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]