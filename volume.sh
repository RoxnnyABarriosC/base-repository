#!/bin/bash

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]
then
    echo "Please provide the folder name as an argument."
    exit 1
fi

VOLUME_NAME="${PROJECT_NAME}_api"

if docker volume inspect $VOLUME_NAME >/dev/null 2>&1; then
    docker volume rm $VOLUME_NAME && echo "Volume $VOLUME_NAME was successfully deleted"
else
   echo "The volume does not exist"
fi
