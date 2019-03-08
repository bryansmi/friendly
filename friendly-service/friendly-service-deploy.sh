#!/bin/bash
CURRENT_VERSION=$(cat version.txt)
echo "Current verison: $CURRENT_VERSION"

CURRENT_MINOR=$(echo $CURRENT_VERSION | cut -d'.' -f2) 
CURRENT_MAJOR=$(echo $CURRENT_VERSION | cut -d'.' -f1) 
NEW_MINOR=$(($CURRENT_MINOR + 1))
NEW_VERSION=$CURRENT_MAJOR"."$NEW_MINOR
echo "New version: $NEW_VERSION"

echo "Writing new version to version.txt"
echo $NEW_VERSION > version.txt
VERSION=$(cat version.txt)
echo "Version: $VERSION"

echo "Remove old friendly-service image"
docker image rm friendly-service:latest
echo "Build new image as bryansmi/private:friendly-service-$VERSION"
docker image build . -t bryansmi/private:friendly-service-$VERSION
echo "Push to registry"
docker image push bryansmi/private:friendly-service-$VERSION
