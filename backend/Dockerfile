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
# This is where Prisma CLI gets installed
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code including the prisma folder
COPY . .

# Generate the Prisma client
# This step succeeds because all dependencies, including Prisma CLI, are present
RUN pnpm exec prisma generate


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

# Copy the generated Prisma client from the builder stage to the production image
# This is the crucial step that was missing
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client* ./node_modules/@prisma/client

# Copy the prisma schema, which is needed at runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# --- Security Best Practice: Run as a non-root user ---
# Create a dedicated user and group for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Switch to the new user
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "run", "start"]