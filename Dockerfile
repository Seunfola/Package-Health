
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
