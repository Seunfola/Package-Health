# Stage 1: Build the Angular app
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (using frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile
# Copy the rest of the app source code
COPY . .

# (optional) Run panda codegen if panda.config.ts exists
# RUN pnpm run panda:codegen

# Build the Angular app for production
RUN pnpm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine

# Copy built files from the build stage
COPY --from=build /app/dist/package-health /usr/share/nginx/html

# Copy a custom nginx configuration (you'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
