FROM node:22-alpine AS base

# Install OS deps needed by Prisma (OpenSSL) and node-gyp builds
RUN apk add --no-cache openssl python3 make g++

WORKDIR /usr/src/app

# --- Dependencies layer ---
FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# --- Build layer ---
FROM base AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN npm run build

# --- Production runtime ---
FROM node:22-alpine AS prod
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Only production deps
COPY package*.json ./

# Copy build output and prisma artifacts
COPY --from=build /usr/src/app/dist ./dist
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=deps /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# App ports and command
EXPOSE 3000
CMD ["node", "dist/src/main.js"]


