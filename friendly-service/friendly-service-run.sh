#!/bin/bash
# TODO: Refactor this to take a friendly-secrets.json as a param as well
# docker login
echo "$(date): friendly-service-run: Logging into docker hub."
DOCKER_USERNAME=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubUsername" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
DOCKER_PASSWORD=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubPassword" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD

# get all repo images 
DOCKER_REPO=$(cat ./src/secrets/friendly/friendly-secrets.json | grep "dockerHubRepository" | cut -d ":" -f2 | sed 's/[",,]//g' | tr -d '[:space:]')
echo "$(date): friendly-service-run: Pulling latest images."
docker pull $DOCKER_REPO -a

# use latest version
LATEST=$(docker image ls | grep -o 'friendly-service[^ ]*' | head -n 1)

## TODO: use repo from `friendly-secrets.json` config
echo "$(date): friendly-service-run: Using version $LATEST."
IMAGE_NAME="$DOCKER_REPO:$LATEST"

# docker image get
IMAGE_EXISTS="$(docker images $IMAGE_NAME | sed -n 2p)"
if [[ -z "$IMAGE_EXISTS" ]]; then
    echo "$(date) friendly-service-run: Found local image."
else
    echo "$(date) friendly-service-run: Acquiring image."
    docker pull $IMAGE_NAME
fi

# start friendly-service
echo "$(date) friendly-service-run: Starting friendly-service with image $IMAGE_NAME"
docker run -p 8080:8080 $IMAGE_NAME
