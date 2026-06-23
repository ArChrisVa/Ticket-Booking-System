# Phase 2 dev image for the auth service: install deps, run with hot-reload (tsx watch).
FROM node:20-alpine

WORKDIR /app

# Copy manifests first so Docker can cache `npm install` when only source changes.
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]
