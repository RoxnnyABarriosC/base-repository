#!/bin/bash

#    APPLY_REDIRECT=true
#    PROJECT_NAME=base_repository

STAGE=dev \
    API_PORT=3000 \
    TLS=false \
    ENTRYPOINT=http \
    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d
