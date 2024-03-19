# Step 1: Use an official Node base image with a specific version tag
FROM node:14-alpine as build

# Step 2: Set the working directory inside the image
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to leverage Docker cache layers
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your app's source code
COPY . .

# Step 6: Build your React app
RUN npm run build

# Step 7: Use a light-weight version of Node
FROM nginx:alpine

# Step 8: Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to the outside once the container has launched
EXPOSE 80

# Step 10: Define the command to run your app
# No need to specify CMD because it's inherited from the nginx base image
