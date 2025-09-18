# --- Builder Stage ---
# Use node:20-alpine as a lightweight base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files AND the lockfile
COPY package.json package-lock.json ./

# Copy all application source code, including prisma schema
COPY . .

# Install all dependencies (including devDependencies)
RUN npm install

# Build the TypeScript project
RUN npm run build


# --- Production Stage ---
# Start fresh from the same lightweight base image
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package files AND the lockfile from the builder stage
COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma schema and the generated client from the builder stage
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Set ownership of the application directory to the non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# The command to run the application
CMD ["npm", "run", "start"]