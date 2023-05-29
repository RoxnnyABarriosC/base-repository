#!/bin/bash

#    APPLY_REDIRECT=true;

STAGE=dev \
    API_PORT=3000 \
    TLS=false \
    ENTRYPOINT=http \
    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d
