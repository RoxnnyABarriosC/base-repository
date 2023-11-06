install:
	@echo '************                               ************'
	@echo '************       INSTALL PACKAGES        ************'
	@echo '************                               ************'
	pnpm i

network:
	@echo '************                               ************'
	@echo '************         CREATE NETWORK        ************'
	@echo '************                               ************'
	sh network.sh $${PROJECT_NAME:-base_repository}

volume:
	@echo '************                               ************'
	@echo '************         CREATE VOLUME         ************'
	@echo '************                               ************'
	sh volume.sh $${PROJECT_NAME:-base_repository}

up:
	@echo '************                               ************'
	@echo '************        UP CONTAINERS          ************'
	@echo '************                               ************'
	docker compose -f docker-compose.yml -f docker-compose-dev.yml up -d

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

clean:
	docker compose down -v --remove-orphans
	docker ps -a | grep _run_ | awk '{print $$1}' | xargs -I {} docker rm {}
