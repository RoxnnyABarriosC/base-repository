#!/bin/bash

#    APPLY_REDIRECT=true
#    PROJECT_NAME=base_repository

#STAGE=dev \
#    API_PORT=3000 \
#    TLS=false \
#    ENTRYPOINT=http \
#    S3_DOMAIN=192.168.31.127:9002 \
#    S3_URL=http://192.168.31.127:9002 \
#    S3_CONSOLE_DOMAIN=192.168.31.127:9001 \
#    S3_CONSOLE_URL=http://192.168.31.127:9001 \
#    S3_CONSOLE_PATH=/ \
#    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d

STAGE=dev \
    API_PORT=3000 \
    TLS=false \
    ENTRYPOINT=http \
    S3_DOMAIN=192.168.1.125:9002 \
    S3_URL=http://192.168.1.125:9002 \
    S3_CONSOLE_DOMAIN=192.168.1.125:9001 \
    S3_CONSOLE_URL=http://192.168.1.125:9001 \
    S3_CONSOLE_PATH=/ \
    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d
