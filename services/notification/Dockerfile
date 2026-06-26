# Phase 4 dev image for the notification service: install deps, run with hot-reload.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "run", "dev"]
