FROM node:18-alpine AS base
WORKDIR /app
COPY package.json tsconfig.json .

FROM base as build
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base as production-build
RUN npm install --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

FROM node:18-alpine as production
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
COPY prisma ./prisma
COPY --from=production-build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]