# packages/frontend/Dockerfile
FROM node:18-alpine AS deps
# Set working directory
WORKDIR /app
# Copy package files
COPY package.json package-lock.json* ./
COPY packages/frontend/package.json ./packages/frontend/
# Install dependencies
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
# Copy all node_modules and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the project
RUN npm run build -w @carbon-impact/frontend

FROM node:18-alpine AS runner
WORKDIR /app
RUN rm -rf ./* || true

ENV NODE_ENV=production
# Copy necessary files 
COPY --from=builder /app/packages/frontend/next.config.js ./
COPY --from=builder /app/packages/frontend/.next ./.next
COPY --from=builder /app/packages/frontend/public ./public
COPY --from=builder /app/packages/frontend/package.json ./
# Install production dependencies
RUN npm install --only=production

EXPOSE 3000
CMD ["npm", "start"]