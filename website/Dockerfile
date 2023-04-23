# Use an official Node.js runtime as a parent image
FROM node:17-alpine as builder

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install --silent
COPY . .
RUN npm run build

# start app
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]