# Stage 1: Build the Angular app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production
# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine

# Copy built files from the build stage
COPY --from=build /app/dist/package-health /usr/share/nginx/html

# Copy a custom nginx configuration (you'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
