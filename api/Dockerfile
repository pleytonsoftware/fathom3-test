FROM node:14-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4020

# CMD ["npm", "start"]
CMD ["./start.sh"]
