# Base image for both development and production
FROM node:14-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Development build stage
FROM base as development
# Set environment variable to development
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH
# Expose the port the dev server runs on
EXPOSE 3000
# Start the development server
CMD ["npm", "start"]

# Production build stage
FROM base as production
# Set environment variable to production
ENV NODE_ENV=production
# Build the app for production
RUN npm run build
# Serve the production build with a static server
FROM nginx:alpine as production-serve
COPY --from=production /app/build /usr/share/nginx/html
# Expose port 80 for the production server
EXPOSE 80
# Nginx serves the static files
CMD ["nginx", "-g", "daemon off;"]

#Docker build for dev
#docker build --target development -t myapp-frontend:dev .

#docker build for prod
#docker build --target production-serve -t myapp-frontend:prod .
