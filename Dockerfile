FROM node:18-alpine as installer
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:18-alpine as app
WORKDIR /app
COPY . .
COPY --from=installer /app/node_modules ./node_modules

CMD ["node", "index.js"]