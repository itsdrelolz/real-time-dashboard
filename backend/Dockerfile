# --- Builder Stage ---
# Use node:20-alpine as a lightweight base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files AND the lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Generate the Prisma client
RUN npx prisma generate

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
RUN pnpm install --frozen-lockfile --prod

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma schema
COPY --from=builder /usr/src/app/prisma ./prisma

# Generate Prisma client in production stage
RUN npx prisma generate

# --- Security Best Practice: Run as a non-root user ---
# Create a dedicated user and group for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Switch to the new user
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "run", "start"]


