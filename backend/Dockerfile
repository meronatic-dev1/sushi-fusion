# Base image
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3001

# Start command — sync DB schema then run
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run start:prod"]
