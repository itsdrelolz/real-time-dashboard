# --- Builder Stage ---
    FROM node:20-alpine AS builder
    WORKDIR /usr/src/app
    
    # Install pnpm
    RUN npm install -g pnpm
    
    # Install deps without running postinstall (prisma generate)
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile --ignore-scripts
    
    # Ensure schema exists before generating client
    COPY prisma ./prisma
    RUN pnpm exec prisma generate
    
    # Copy the rest and build
    COPY . .
    RUN pnpm run build
    
    # --- Production Stage ---
    FROM node:20-alpine AS production
    WORKDIR /usr/src/app
    
    RUN npm install -g pnpm
    
    # Install only prod deps without scripts
    COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile --prod --ignore-scripts
    
    # Copy prisma schema and generate client in prod image
    COPY --from=builder /usr/src/app/prisma ./prisma
    RUN pnpm exec prisma generate
    
    # Copy built app
    COPY --from=builder /usr/src/app/dist ./dist
    
    # Non-root
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    EXPOSE 3000
    CMD ["pnpm", "run", "start"]