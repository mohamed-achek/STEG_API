# Use a Node.js image as base image for building
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Use a smaller base image for serving the built files
FROM nginx:alpine AS production

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port (default for Nginx is 80)
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:18 AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the port (default for React apps is 3000)
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "start"]
