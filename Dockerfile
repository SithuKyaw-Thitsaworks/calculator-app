# Use the base image from DockerHub
FROM node:20.10.0-alpine3.18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .


# Build the TypeScript files (if you are using TypeScript)
RUN npm run build

EXPOSE 12000

# Set the CMD command to run "npm run start" (or "npm run service")
CMD ["npm", "run", "start"]