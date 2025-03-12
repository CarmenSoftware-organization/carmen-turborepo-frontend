# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY . .
# Install dependencies
RUN npm install

# Copy the rest of the application code

RUN npm run postinstall
COPY ./project.inlang ./app/project.inlang

# Build the application
RUN npx next build

# Expose the port the app runs on
EXPOSE 3500

# Start the application
CMD ["npm", "start"]