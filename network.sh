#!/bin/bash

docker network inspect external_base_repository_network >/dev/null 2>&1 && echo "La red external_base_repository_network ya existe" || docker network create -d bridge external_base_repository_network && echo "La red fue creada"
