#!/bin/bash

# docker login
echo "$(date): friendly-service-run: Logging into docker hub."
DOCKER_USERNAME=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubUsername" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
DOCKER_PASSWORD=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubPassword" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
DOCKER_REPO=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubRepository" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')

docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD

# update version
CURRENT_VERSION=$(cat version.txt)
echo "$(date) friendly-service-deploy: Current verison: $CURRENT_VERSION"

CURRENT_MINOR=$(echo $CURRENT_VERSION | cut -d'.' -f2) 
CURRENT_MAJOR=$(echo $CURRENT_VERSION | cut -d'.' -f1) 
NEW_MINOR=$(($CURRENT_MINOR + 1))
NEW_VERSION=$CURRENT_MAJOR"."$NEW_MINOR
echo "$(date) friendly-service-deploy: New version: $NEW_VERSION"

echo "$(date) friendly-service-deploy: Writing new version to version.txt"
echo $NEW_VERSION > version.txt
VERSION=$(cat version.txt)
echo "$(date) friendly-service-deploy: Version: $VERSION"

# push new image
echo "$(date) friendly-service-deploy: Remove old friendly-service image"
docker image rm friendly-service:latest
echo "$(date) friendly-service-deploy: Build new image as bryansmi/private:friendly-service-$VERSION"
docker image build . -t $DOCKER_REPO:friendly-service-$VERSION
echo "$(date) friendly-service-deploy: Push to registry"
docker image push $DOCKER_REPO:friendly-service-$VERSION
