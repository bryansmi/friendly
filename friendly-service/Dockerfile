FROM node:8.2.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./src/secrets ./src/secrets
COPY ./bin ./bin

EXPOSE 8080
CMD [ "npm", "start" ]
