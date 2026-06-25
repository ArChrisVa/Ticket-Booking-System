# Phase 3 dev image for the booking service: install deps, run with hot-reload (tsx watch).
FROM node:20-alpine

WORKDIR /app

# Copy manifests first so Docker can cache `npm install` when only source changes.
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "run", "dev"]
