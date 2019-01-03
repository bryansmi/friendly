#!/bin/bash

# get version
if [[ $1 ]]; then
    VERSION=$1
else
    VERSION="1.0"
fi

echo "$(date): friendly-service: Using version $VERSION."
IMAGE_NAME="bryansmi/private:friendly-service-$VERSION"

# docker login
echo "$(date) friendly-service: Logging into docker hub."
cat /usr/local/secrets/dockerhub.txt | docker login --username bryansmi --password-stdin

# docker image get
IMAGE_EXISTS="$(docker images $IMAGE_NAME | sed -n 2p)"
if [[ -z "$IMAGE_EXISTS" ]]; then
    echo "$(date) friendly-service: Found local image."
else
    echo "$(date) friendly-service: Acquiring image."
    docker pull $IMAGE_NAME
fi

# start friendly-service
echo "$(date) friendly-service: Starting friendly-service."
docker run -p 8080:8080 $IMAGE_NAME
docker logout
