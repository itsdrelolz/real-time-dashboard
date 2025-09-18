# --- Builder Stage ---
# Use node:20-alpine as a lightweight base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package manifest and lockfile for deterministic install
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN pnpm exec prisma generate

# Copy the rest of the application source code
COPY . .

# Build the TypeScript project
RUN pnpm run build


# --- Production Stage ---
# Start fresh from the same lightweight base image
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install pnpm for the production stage
RUN npm install -g pnpm

# Copy package manifest and lockfile
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

**# Copy the generated Prisma client from the builder stage**
**COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client@* ./node_modules/.pnpm/@prisma+client@***

# --- Security Best Practice: Run as a non-root user ---
# Create a dedicated user and group for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to the new user
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "run", "start"]