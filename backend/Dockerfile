# --- Builder Stage ---
# Use node:20-alpine as a lightweight base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files AND the lockfile
COPY package.json pnpm-lock.yaml ./

# Copy all application source code, including prisma schema, BEFORE installing dependencies
COPY . .

# Install all dependencies (including devDependencies)
# This will now succeed as the prisma folder is present
RUN pnpm install --frozen-lockfile

# Build the TypeScript project
RUN pnpm run build


# --- Production Stage ---
# Start fresh from the same lightweight base image
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files AND the lockfile from the builder stage
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./

# Install only production dependencies
# This correctly skips devDependencies, including Prisma CLI
RUN pnpm install --frozen-lockfile --prod

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma schema, which is needed at runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# Copy the generated Prisma client from the builder stage
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client* ./node_modules/@prisma/client

# Set ownership of the application directory to the non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "run", "start"]