FROM node:18-alpine as installer
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:18-alpine as app
WORKDIR /app
USER node
COPY --chown=node:node . .
COPY --from=installer --chown=node:node /app/node_modules ./node_modules

CMD ["node", "index.js"]