# Stage 1: Build Expo Web app
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./


# Install dependecies
RUN npm install --legacy-peer-deps
# Copy the rest of the project
COPY . .

# Export web static files to /app/dist
RUN npx expo export --platform web

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy custom NGINX config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static web export from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]