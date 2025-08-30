#-------------------
# Development
#-------------------
FROM node:20-alpine AS development

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies using pnpm
RUN pnpm install

# Copy application source code
COPY . .

#-------------------
# Production Build
#-------------------
FROM node:20-alpine AS build

RUN apk add --no-cache curl bash g++ make

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

# Copy package files and lock
COPY package.json pnpm-lock.yaml ./

# Copy installed dependencies from dev stage
COPY --from=development /usr/src/app/node_modules ./node_modules

# Copy the rest of the application source
COPY . .

# Build the NestJS app (assumes default dist output)
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod

#-------------------
# Final Production Image
#-------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built app and runtime dependencies only
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./

# Run the application
CMD ["node", "dist/main.js"]
