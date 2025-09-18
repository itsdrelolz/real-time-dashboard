# --- Builder Stage ---
# Use node:20-alpine as a lightweight base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files, lockfile, and all other source code
COPY . .

# Install all dependencies (including devDependencies)
# This installs the Prisma CLI
RUN pnpm install --frozen-lockfile

# This runs the postinstall script from package.json, which is 'prisma generate'.
# Since the Prisma schema is now in the container, it succeeds.
# The generated client is now located in node_modules/.pnpm/@prisma+client@...

# Build the TypeScript project
RUN pnpm run build


# --- Production Stage ---
# Start fresh from the same lightweight base image
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and the lockfile from the builder stage
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./

# Install only production dependencies
# This is much faster and creates a smaller image
RUN pnpm install --frozen-lockfile --prod

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma schema, which is needed at runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# Copy the generated Prisma client from the builder stage
# The path is specific to how pnpm organizes modules
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client* ./node_modules/@prisma/client

# --- Security Best Practice: Run as a non-root user ---
# Create a dedicated user and group for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Switch to the new user
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "run", "start"]