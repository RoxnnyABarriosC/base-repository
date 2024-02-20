PROJECT_NAME ?= base_repository

TLS ?= false
ENTRYPOINT ?= http

#ACME_STAGING ?= true
ACME_EMAIL ?= user@baserepository.com

PROXY_DOMAIN ?= proxy.localhost
LOAD_USERS ?= 'nodebaserepository:$$apr1$$RTZSd6uA$$9zpPRgArFsHX2UWgPNXL..'
#APPLY_REDIRECT ?=

DB_USER ?= baserepository
DB_NAME ?= baserepository
DB_PASSWORD ?= baserepository

S3_USER ?= baserepository
S3_PASSWORD ?= baserepository
S3_DOMAIN ?= s3.localhost
S3_URL ?= http://s3.localhost
S3_CONSOLE_DOMAIN ?= s3.localhost
S3_CONSOLE_URL ?= http://s3.localhost
S3_CONSOLE_PATH ?= /minio/ui/

REDIS_PASSWORD ?= baserepository

STAGE ?= dev

API_PORT ?= 3000
API_DOMAIN ?= api.localhost
API_DOC_DOMAIN ?= doc.api.localhost
