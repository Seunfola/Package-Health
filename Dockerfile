
# Stage 1: Build the Angular app
FROM node:20-alpine AS build

# Self-hosted production topology (see root docker-compose.yml and
# nginx.conf): the browser can't resolve `depvault-api` — that DNS name only
# exists on the compose network, between containers, not from the client —
# and the CSP served by nginx (`default-src 'self'`) would block a direct
# cross-origin call to it regardless. Default is empty, which (see the sed
# below) produces same-origin relative paths ('/api/v1', not
# 'http://depvault-api:3000/api/v1'); nginx.conf reverse-proxies /api/ and
# /auth/ to depvault-api:3000 server-side. Override at build time (e.g.
# `docker build --build-arg API_BASE_URL=https://api.example.com`) only for
# a topology where the API is reachable directly and CORS is configured for
# it — the same-origin-via-proxy setup is the supported default.
ARG API_BASE_URL=

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy ALL application source code, including config files
COPY . .

# Install dependencies, which will run the 'prepare' script successfully
RUN pnpm install --frozen-lockfile

# Angular bakes environment.prod.ts in at build time, so the API base URL
# must be substituted before `ng build` runs, not read at container startup.
RUN sed -i \
      -e "s#apiUrl: '[^']*'#apiUrl: '${API_BASE_URL}/api/v1'#" \
      -e "s#apiBaseUrl: '[^']*'#apiBaseUrl: '${API_BASE_URL}/api'#" \
      -e "s#authUrl: '[^']*'#authUrl: '${API_BASE_URL}/auth'#" \
      src/environments/environment.prod.ts

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
