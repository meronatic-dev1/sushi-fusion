# Base image
FROM node:22-alpine AS builder

WORKDIR /app

# Ensure devDependencies are installed (Coolify may set production=true)
ENV NODE_ENV=development
ENV NPM_CONFIG_PRODUCTION=false

# Install ALL dependencies (including devDependencies like @nestjs/cli)
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN npm run build && test -f dist/main.js

# Production image
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production-only dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/prisma.config.ts ./
RUN npm ci --omit=dev

# Copy Prisma generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start command — sync DB schema then run
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]

