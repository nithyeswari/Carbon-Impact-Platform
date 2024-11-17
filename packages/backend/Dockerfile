# packages/backend/Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
RUN rm -rf ./* || true

# Copy root package.json and workspace package.json
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
# Install dependencies
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
# Copy source
COPY packages/backend ./packages/backend
COPY package*.json ./
# Build
RUN cd packages/backend && npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install correct system dependencies including Python and build tools
RUN apk update && \
    apk add --no-cache \
        eudev-dev \
        bluez \
        bluez-dev \
        make \
        gcc \
        g++ \
        python3 \
        python3-dev \
        py3-pip \
        linux-headers \
        udev \
        git \
        py3-setuptools

# Create app directory and set permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Copy built files and configs
COPY --from=builder --chown=node:node /app/packages/backend/dist ./dist
COPY --from=builder --chown=node:node /app/packages/backend/package*.json ./

# Install production dependencies only
RUN npm install --production

EXPOSE 4000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["npm", "start"]

# Development Dockerfile
# packages/backend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install development dependencies including Python
RUN apk update && \
    apk add --no-cache \
        eudev-dev \
        bluez \
        bluez-dev \
        make \
        gcc \
        g++ \
        python3 \
        python3-dev \
        py3-pip \
        linux-headers \
        udev \
        git \
        py3-setuptools

# Create app directory
RUN mkdir -p /app/data

COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "dev"]
