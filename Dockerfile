<<<<<<< HEAD
# Stage 1: Build the Angular app
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy ALL application source code, including config files
COPY . .

# Install dependencies, which will run the 'prepare' script successfully
RUN pnpm install --frozen-lockfile

# Build the Angular app for production
RUN pnpm run build --configuration production
RUN ls -l /app/dist
# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
=======
# ---- Stage 1: Build Angular SSR ----
FROM node:22-alpine AS build

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm run build:ssr

# Build SSR (browser + server bundles)
RUN pnpm run build

# ---- Stage 2: Run Node SSR Server ----
FROM node:22-alpine AS runner
WORKDIR /app

# Copy built app
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

# Environment + port
ENV NODE_ENV=production
EXPOSE 3000

# Run the Angular SSR entry
CMD ["node", "dist/Package-Health/server/server.mjs"]
>>>>>>> b39f80f (Re-add project with updated HeroSection and Angular 16+ HttpClient)
