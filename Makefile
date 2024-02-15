#########################       CONFIG      #######################

network:
	@echo '************                               ************'
	@echo '************         CREATE NETWORK        ************'
	@echo '************                               ************'
	sh network.sh $${PROJECT_NAME:-base_repository}

volume:
	@echo '************                               ************'
	@echo '************         CLEAN VOLUME          ************'
	@echo '************                               ************'
	sh volume.sh $${PROJECT_NAME:-base_repository}

#########################        DOC        #######################

doc:
	@echo '************                               ************'
	@echo '************        DOC BUILD     	      ************'
	@echo '************                               ************'
	make down-doc && TLS=$${TLS:-false} ENTRYPOINT=$${ENTRYPOINT:-http} \
		DOC_API_DOMAIN=$${DOC_API_DOMAIN:-doc.api.localhost} \
		docker compose -f docker-compose-doc.yml up --build -d

down-doc:
	@echo '************                               ************'
	@echo '************        DOC DOWN     	      ************'
	@echo '************                               ************'
	docker compose -f docker-compose-doc.yml down

stop-doc:
	@echo '************                               ************'
	@echo '************        DOC INIT     	      ************'
	@echo '************                               ************'
	docker compose -f docker-compose-doc.yml stop

#########################       PROXY       #######################

proxy:
	@echo '************                               ************'
	@echo '************        DOC INIT     	      ************'
	@echo '************                               ************'
	docker compose -f docker-compose-proxy.yml up --build -d
	make down-proxy && TLS=$${TLS:-false} ENTRYPOINT=$${ENTRYPOINT:-http} \
			LOCAL_PROXY=$${LOCAL_PROXY} \
			ACME_STAGING=$${ACME_STAGING} \
    		PROXY_DOMAIN=$${PROXY_DOMAIN:-proxy.localhost} \
    		ACME_EMAIL=$${ACME_EMAIL:-user@baserepository.com} \
    		docker compose -f docker-compose-proxy.yml up --build -d

down-proxy:
	@echo '************                               ************'
	@echo '************        DOC INIT     	      ************'
	@echo '************                               ************'
	docker compose -f docker-compose-proxy.yml down

stop-proxy:
	@echo '************                               ************'
	@echo '************        DOC INIT     	      ************'
	@echo '************                               ************'
	docker compose -f docker-compose-proxy.yml stop

#########################      SERVER      #######################

local:
	@echo '************                               ************'
	@echo '************        DEV LOCAL     	      ************'
	@echo '************                               ************'
	sh local-server.sh

dev:
	@echo '************                               ************'
	@echo '************        DEV INIT     	      ************'
	@echo '************                               ************'
	sh dev-server.sh


prod:
	@echo '************                               ************'
	@echo '************        PROD INIT    	      ************'
	@echo '************                               ************'
	sh prod-server.sh

down:
	@echo '************                               ************'
	@echo '************        DOWN CONTAINERS        ************'
	@echo '************                               ************'
	docker compose -f docker-compose.yml -f docker-compose-dev.yml down

stop:
	@echo '************                               ************'
	@echo '************        STOP CONTAINERS        ************'
	@echo '************                               ************'
	docker compose -f docker-compose.yml -f docker-compose-dev.yml stop

#########################       EXEC       #######################

exec:
	@echo '************                               ************'
	@echo '************       EXEC BASH API           ************'
	@echo '************                               ************'
	STAGE=${STAGE} docker compose exec api bash

sh:
	@echo '************                               ************'
	@echo '************        Exec SH NODE    	      ************'
	@echo '************                               ************'
	docker compose exec api sh

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
	docker compose down -v --remove-orphans
	docker rmi $$(docker images -f "dangling=true" -q)
	docker ps -a | grep _run_ | awk '{print $$1}' | xargs -I {} docker rm {}

clean-soft:
	docker compose down --remove-orphans
	sh volume.sh $${PROJECT_NAME:-base_repository}
	docker rmi $$(docker images -f "dangling=true" -q)
	docker ps -a | grep _run_ | awk '{print $$1}' | xargs -I {} docker rm {}
