#!/bin/bash
set -e

# run tests
npm run test

# docker login
echo "$(date): friendly-service-run: Logging into docker hub."
DOCKER_USERNAME=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubUsername" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
DOCKER_PASSWORD=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubPassword" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
DOCKER_REPO=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubRepository" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')

docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD

# update version using commit and time
GIT_HASH=$(git log --pretty=format:'%h' -n 1)
DATE_SECONDS=$(date +"%s")
IMAGE_VERSION=$DOCKER_REPO:friendly-service-$GIT_HASH-$DATE_SECONDS

# push new image
echo "$(date) friendly-service-deploy: Build new image as $IMAGE_VERSION"
docker image build . -t $IMAGE_VERSION
echo "$(date) friendly-service-deploy: Push $IMAGE_VERSION to registry"
docker image push $IMAGE_VERSION
