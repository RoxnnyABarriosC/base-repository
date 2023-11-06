#!/bin/bash

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]
then
    echo "Please provide the project name as an argument."
    exit 1
fi

NETWORK_NAME="external_${PROJECT_NAME}_network"

if docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
    echo "Network $NETWORK_NAME already exists"
else
    docker network create -d bridge $NETWORK_NAME && echo "The network $NETWORK_NAME was created"
fi
