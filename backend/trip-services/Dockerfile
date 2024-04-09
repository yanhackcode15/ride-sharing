# Base image
FROM node:16-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Development image
FROM base as development
# Install nodemon for development
RUN npm install -g nodemon
# Set environment variable to development
ENV NODE_ENV=development
# Expose port 3001 for the dev server
EXPOSE 3001
# Use nodemon to start the app
CMD ["nodemon", "server.js"]

# Production image
FROM base as production
# Set environment variable to production
ENV NODE_ENV=production
# Expose port 3001
EXPOSE 3001
# Start the app
CMD ["node", "server.js"]


#build image for dev:
#docker build --target development -t myapp-backend:dev .
#run container for dev:
# docker run -p 3001:3001 myapp-backend:dev

#build image for prod
#docker build --target production -t myapp-backend:prod .
