# Use a Node.js image as base image
FROM node:18

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

# Use a simple web server to serve the built files (e.g., serve)
RUN npm install -g serve

# Expose the port (default for React apps is 3000)
EXPOSE 3000

# Start the app using 'serve' to serve the production build
CMD ["serve", "-s", "build", "-l", "3000"]
