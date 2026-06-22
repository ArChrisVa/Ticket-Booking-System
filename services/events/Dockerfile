# Phase 0 dev image: install deps, run with hot-reload (tsx watch).
# We'll harden this into a multi-stage production build in a later phase.
FROM node:20-alpine

WORKDIR /app

# Copy manifests first so Docker can cache `npm install` when only source changes.
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
