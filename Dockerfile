# Stage 1: Build the application
FROM node:20-alpine AS builder

# Add git (if needed for your build process)
RUN apk add --no-cache git

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (use --frozen-lockfile for production)
RUN npm install --frozen-lockfile

# Copy the rest of the source code
# The .dockerignore file will prevent sensitive files from being copied here.
COPY . .

# Build the app (adjust if your build script differs)
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your optimized Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the production build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set permissions for Nginx files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]