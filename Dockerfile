# Use an official Node.js runtime as a parent image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app with Vite
RUN npm run build

# Use a smaller base image for the production build
FROM node:14-alpine

# Set the working directory in the new container
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Install `serve` globally to serve the app
RUN npm install -g serve

# Expose port 5000 for the app
EXPOSE 5000

# Start the app using `serve` on port 5000
CMD ["serve", "-s", "dist", "-l", "5000"]