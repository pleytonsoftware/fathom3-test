# FROM node:14-alpine

# WORKDIR /website

# COPY package*.json ./

# RUN npm install
# RUN npm run build

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]

# Set the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /website

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app for production
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
