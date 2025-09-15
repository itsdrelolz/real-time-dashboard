FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN pnpm ci

COPY . .

RUN npx prisma generate

# Build the TypeScript project
RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN pnpm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma


EXPOSE 3000

CMD ["pnpm", "run", "start"]
