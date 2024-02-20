include config.mk
include default.mk

#########################       CONFIG      #######################

network:
	@echo '************                               ************'
	@echo '************         CREATE NETWORK        ************'
	@echo '************                               ************'
	sh network.sh $(PROJECT_NAME)

volume:
	@echo '************                               ************'
	@echo '************         CLEAN VOLUME          ************'
	@echo '************                               ************'
	sh volume.sh $(PROJECT_NAME)

#########################       PROXY       #######################

proxy:
	@echo '************                               ************'
	@echo '************             PROXY     	      ************'
	@echo '************                               ************'
	TLS=$(TLS) \
			ENTRYPOINT=$(ENTRYPOINT) \
			ACME_STAGING=$(ACME_STAGING) \
    		PROXY_DOMAIN=$(PROXY_DOMAIN) \
    		ACME_EMAIL=$(ACME_EMAIL) \
    		APPLY_REDIRECT=$(APPLY_REDIRECT) \
    		LOAD_USERS=$(LOAD_USERS) \
    		PROJECT_NAME=$(PROJECT_NAME) \
    		docker compose -f docker-compose-proxy.yml \
    		$(if $(filter down,$(MAKECMDGOALS)),down,$(if $(filter stop,$(MAKECMDGOALS)),stop, up -d))  \
            $(if $(filter build,$(MAKECMDGOALS)),--build,)

#########################       SERVICES       #######################

services:
	@echo '************                               ************'
	@echo '************         SERVICES    	      ************'
	@echo '************                               ************'
	TLS=$(TLS) \
			ENTRYPOINT=$(ENTRYPOINT) \
			DB_USER=$(DB_USER) \
			DB_NAME=$(DB_NAME) \
			DB_PASSWORD=$(DB_PASSWORD) \
			S3_USER=$(S3_USER) \
			S3_PASSWORD=$(S3_PASSWORD) \
			S3_DOMAIN=$(S3_DOMAIN) \
			S3_URL=$(S3_URL) \
            S3_CONSOLE_DOMAIN=$(S3_CONSOLE_DOMAIN) \
            S3_CONSOLE_URL=$(S3_CONSOLE_URL) \
            S3_CONSOLE_PATH=$(S3_CONSOLE_PATH) \
            REDIS_PASSWORD=$(REDIS_PASSWORD) \
            PROJECT_NAME=$(PROJECT_NAME) \
            docker compose -f docker-compose-services.yml \
            $(if $(filter down,$(MAKECMDGOALS)),down,$(if $(filter stop,$(MAKECMDGOALS)),stop, up -d))  \
            $(if $(filter build,$(MAKECMDGOALS)),--build,)

#########################       API       #######################

api:
	@echo '************                               ************'
	@echo '************             API     	      ************'
	@echo '************                               ************'
	STAGE=$(STAGE) \
			TLS=$(TLS) \
            ENTRYPOINT=$(ENTRYPOINT) \
			API_PORT=$(API_PORT) \
			API_DOMAIN=$(API_DOMAIN) \
            PROJECT_NAME=$(PROJECT_NAME) \
            docker compose -f docker-compose.yml \
            $(if $(filter local,$(MAKECMDGOALS)),-f docker-compose-dev.yml,) \
            $(if $(filter down,$(MAKECMDGOALS)),down,$(if $(filter stop,$(MAKECMDGOALS)),stop, up -d))  \
            $(if $(filter build,$(MAKECMDGOALS)),--build,)

#########################      SERVER      #######################

server:
	@echo '************                               ************'
	@echo '************            SERVER  	          ************'
	@echo '************                               ************'
	$(if $(filter local,$(MAKECMDGOALS)),sh local-server.sh,$(if $(filter dev,$(MAKECMDGOALS)),sh dev-server.sh, sh prod-server.sh))

#########################        DOC        #######################

doc:
	@echo '************                               ************'
	@echo '************             DOC        	      ************'
	@echo '************                               ************'
	TLS=$(TLS) \
        ENTRYPOINT=$(ENTRYPOINT) \
		API_DOC_DOMAIN=$(API_DOC_DOMAIN) \
		PROJECT_NAME=$(PROJECT_NAME) \
		docker compose -f docker-compose-doc.yml \
		$(if $(filter down,$(MAKECMDGOALS)),down,$(if $(filter stop,$(MAKECMDGOALS)),stop, up -d))  \
        $(if $(filter build,$(MAKECMDGOALS)),--build,)

#########################       EXEC       #######################

exec:
	@if [ -z "$(service)" ]; then \
		echo "Error: service is not specified. Use 'make exec service=service_name'"; \
		exit 1; \
	fi
	@echo "************                               ************"
	@echo "************             EXEC              ************"
	@echo "************                               ************"
	docker compose exec $(service) $(if $(filter sh,$(MAKECMDGOALS)),sh,bash)

#########################        DB        #######################

migrate:
	@echo '************                               ************'
	@echo '************        MIGRATE DB    	      ************'
	@echo '************                               ************'
	docker compose exec api npm run migrate

seed:
	@echo '************                               ************'
	@echo '************          SEED DB    	      ************'
	@echo '************                               ************'
	docker compose exec api npm run seed

#########################       CLEAN       #######################

clean:
	docker compose down $(if $(filter hard,$(MAKECMDGOALS)),-v --remove-orphans,--remove-orphans && sh volume.sh $(PROJECT_NAME))
	docker rmi $$(docker images -f "dangling=true" -q)
	docker ps -a | grep _run_ | awk '{print $$1}' | xargs -I {} docker rm {}

#########################       DUMMY       #######################

%:
	@:
