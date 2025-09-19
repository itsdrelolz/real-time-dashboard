# --- Builder Stage ---
# Use a Node.js 20 Alpine image for the build stage.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package manifest and lockfile for dependency installation.
COPY package.json package-lock.json ./

# Install all dependencies without running postinstall scripts
RUN npm ci --ignore-scripts

# Copy the Prisma schema and generate the client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application source code.
COPY . .

# Build the TypeScript project.
RUN npm run build

# --- Production Stage ---
# Use a fresh, clean Node.js 20 Alpine image for the final production image.
FROM node:20-alpine AS production

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package manifest and lockfile.
COPY package.json package-lock.json ./

# Install only production dependencies to keep the image size small.
RUN npm ci --only=production --ignore-scripts

# Copy the Prisma schema and generate the client in production
COPY prisma ./prisma
RUN npx prisma generate

# Copy the built application code from the builder stage.
COPY --from=builder /usr/src/app/dist ./dist

# Run as a non-root user for security best practices.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port that Cloud Run will use
EXPOSE 8080

# Set default environment variables for Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Command to run the application.
CMD ["npm", "run", "start"]