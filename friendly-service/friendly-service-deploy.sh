#!/bin/bash
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

echo "$(date) friendly-service-deploy: Remove old friendly-service image"
docker image rm friendly-service:latest
echo "$(date) friendly-service-deploy: Build new image as bryansmi/private:friendly-service-$VERSION"
docker image build . -t bryansmi/private:friendly-service-$VERSION
echo "$(date) friendly-service-deploy: Push to registry"
docker image push bryansmi/private:friendly-service-$VERSION
