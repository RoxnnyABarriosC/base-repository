#!/bin/bash

docker volume inspect node-base-repository_api >/dev/null 2>&1 && docker volume rm node-base-repository_api && echo "El volumen fue eliminado con éxito" || echo "El volumen no existe"
