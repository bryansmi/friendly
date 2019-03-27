FROM node:8.2.1-alpine

RUN apk add --no-cache tzdata
ENV TZ America/Los_Angeles

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./src/secrets ./src/secrets
COPY ./bin ./bin

EXPOSE 8080
CMD [ "npm", "prod" ]
