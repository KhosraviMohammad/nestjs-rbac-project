FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM base AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


EXPOSE 4173
CMD ["npm", "run", "start"]
