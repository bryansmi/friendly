#!/bin/bash
source $HOME/.bashrc

# docker login
## TODO: Move this secret into `friendly-secrets.json`
echo "$(date): friendly-service-run: Logging into docker hub."
cat /usr/local/secrets/dockerhub.txt | docker login --username bryansmi --password-stdin

# get all repo images 
echo "$(date): friendly-service-run: Pulling latest images."
docker pull bryansmi/private -a

# use latest version
LATEST=$(docker image ls | grep -o 'friendly-service[^ ]*' | head -n 1)

echo "$(date): friendly-service-run: Using version $LATEST."
IMAGE_NAME="bryansmi/private:$LATEST"

# docker image get
IMAGE_EXISTS="$(docker images $IMAGE_NAME | sed -n 2p)"
if [[ -z "$IMAGE_EXISTS" ]]; then
    echo "$(date) friendly-service-run: Found local image."
else
    echo "$(date) friendly-service-run: Acquiring image."
    docker pull $IMAGE_NAME
fi

# start friendly-service
echo "$(date) friendly-service-run: Starting friendly-service."
docker run -p 8080:8080 $IMAGE_NAME
