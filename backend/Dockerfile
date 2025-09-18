# --- Builder Stage ---
# Use a Node.js 20 Alpine image for the build stage.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Install pnpm globally.
RUN npm install -g pnpm

# Copy package manifest and lockfile for dependency installation.
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including development dependencies).
RUN pnpm install --frozen-lockfile

# Copy the Prisma schema and generate the client.
COPY prisma ./prisma
RUN pnpm exec prisma generate

# Copy the rest of the application source code.
COPY . .

# Build the TypeScript project.
RUN pnpm run build

# --- Production Stage ---
# Use a fresh, clean Node.js 20 Alpine image for the final production image.
FROM node:20-alpine AS production

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Install pnpm globally.
RUN npm install -g pnpm

# Copy package manifest and lockfile.
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies to keep the image size small.
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy the built application code from the builder stage.
COPY --from=builder /usr/src/app/dist ./dist

# Copy the generated Prisma client from the builder stage.
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client@* ./node_modules/.pnpm/@prisma+client@*

# Run as a non-root user for security best practices.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port.
EXPOSE 3000

# Command to run the application.
CMD ["pnpm", "run", "start"]