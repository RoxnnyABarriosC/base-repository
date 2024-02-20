# Node Base Repository

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">A progressive <a href="https://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">

## Api Rest

**STATUS:** UNDER DEVELOPMENT

## Table of Contents
1. [Explanation](#explanation)
2. [First Steps](#first-steps)
3. [Installation](#installation)
4. [Start-up](#start-up)
5. [Unit tests](#unit-tests)
6. [Url panel](#url-panel)


## EXPLANATION
___

### PHASES 📅
- [x] Home
- [ ] Planning and estimation
- [ ] Implementation
- [ ] Review and retrospective
- [ ] Launch


### FUNCTIONAL ASPECTS 📋

#### General objective:

-

#### Specific objectives:

-

#### Who is it addressed to:

-

### TECHNICAL ASPECTS 🛠

#### Technological platform:
* Application type: **REST API**
* Development framework: **Nestjs**
* Application Server:
* Database Server:
* Programming Language: **Node js - Typesc

## FIRST STEPS
___

```
$ git clone <url>
```
Set your username and password and press enter. Then go to the <folder> folder.

```sh
cd <folder>
```

## INSTALLATION
___

Install the dependencies and development ones by doing:

```bash
$ pnpm install
```

Then create a new .env file, copy and paste all the variables from the .env.example file and put the corresponding values such as:

```dotenv
NODE_ENV=development
PROJECT_NAME=base_repository
URL_API=http://api.localhost
URL_WEB=http://app.localhost
PREFIX=/api
PORT=3000
VERSION=/v1
WHITE_LIST=api.localhost,http://mail.localhost/

LOGGER_COLORIZE=true
LOGGER_SINGLE_LINE=false
LOGGER_TASK_DELETE_TRACE_LOG='*/30 * * * *'

SENTRY_DSN=https://cf403ff08f4c439981c03d9433e677f4@o4505325982121984.ingest.sentry.io/4505325995819008
SENTRY_ENABLE=false

LOCALE=en

JWT_SECRET=nodebaserepository
JWT_EXPIRES=8h
JWT_CONFIRMATION_EXPIRES=1d
JWT_REFRESH_EXPIRES=1d
JWT_ISS=nodebaserepository
JWT_AUD=nodebaserepository.com
JWT_ALGORITHM='HS512'
JWT_CHECK_BLACK_LIST=true

SET_COOKIE_SECURE=false
SET_COOKIE_SAME_SITE=none

DB_HOST=db
DB_USER=baserepository
DB_DATABASE=baserepository
DB_PASSWORD=baserepository
DB_PORT=5432
DB_SYNCHRONIZE=false
DB_TYPE=postgres
DB_LOGGING=false

PAGINATION_LIMIT=10

ENCRYPTION_DEFAULT=bcrypt

CACHE_HOST=redis
CACHE_PORT=6379
CACHE_PASSWORD=baserepository

SMTP_HOST=mail
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_SECURE_SSL=false
SMTP_SENDER_NAME=Notifications
SMTP_SENDER_EMAIL_DEFAULT=notification@localhost.com

STORAGE_TYPE=s3
STORAGE_HOST=s3
STORAGE_ACCESS_KEY=baserepository
STORAGE_SECRET_KEY=baserepository
STORAGE_USE_SSL=false
STORAGE_PORT=9000
STORAGE_PUBLIC=public.baserepository
STORAGE_PRIVATE=private.baserepository
STORAGE_ROOT_PATH=data
STORAGE_REGION=us-east-1
STORAGE_SIGN_EXPIRE=9000

OTP_LIMIT_ATTEMPTS=50
OTP_TASK_RESTARTING_ATTEMPTS='0 0 * * *'
OTP_CODE_LENGTH=6

TWILIO_ACCOUNT_SID=ACt3st
TWILIO_AUTH_TOKEN=ft3st
TWILIO_FROM_NUMBER=+1234456789
TWILIO_OTP_SERVICE_SID=VAt3st

SENDGRID_TEMPLATE_PUBLIC_OTP_ID=d-t3st
SENDGRID_TEMPLATE_OTP_ID=d-t3st

FB_OAUTH_ID=null
FB_OAUTH_SECRET=null
FB_OAUTH_CALLBACK=http://localhost:4000/api/v1/auth/facebook/callback

GO_OAUTH_ID=null
GO_OAUTH_SECRET=null
GO_OAUTH_CALLBACK=http://localhost:4000/api/v1/auth/google/callback

AP_OAUTH_ID=null
AP_OAUTH_SECRET=null
AP_OAUTH_CALLBACK=http://localhost:4000/api/v1/auth/apple/callback

DOMAINS_ALLOWED_FOR_ADMINISTRATOR_EMAILS=d2d.com,dare2dream.com,museomoda.com

ELAPSED_DAYS_TO_DELETE_A_USER=30

TEMPORAL_BLOCK_TIME=30
TEMPORAL_BLOCK_AUTH_ATTEMPTS=3

```

## START UP
___

### Local Server Intranet
Create file `local-server.sh` in root project

```shell
#!/bin/bash
STAGE=dev \
    API_PORT=3000 \
    TLS=false \
    ENTRYPOINT=http \
    S3_DOMAIN=<YOUR_IP>:9002 \
    S3_URL=http://<YOUR_IP>:9002 \
    S3_CONSOLE_DOMAIN=<YOUR_IP>:9001 \
    S3_CONSOLE_URL=http://<YOUR_IP>:9001 \
    S3_CONSOLE_PATH=/ \
    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d
```
run the file in the terminal

### Production Server
Create file `prod-server.sh` in root project

```shell
#!/bin/bash

docker compose down && \
    sh volume.sh museo_moda && \
    STAGE=prod \
    API_PORT=4000 \
    TLS=true \
    ENTRYPOINT=https \
    API_DOMAIN=<API_DOMAIN_DNS> \
    S3_DOMAIN=<S3_DOMAIN_DNS> \
    S3_URL=https://<S3_DOMAIN_DNS> \
    S3_CONSOLE_DOMAIN=<S3_CONSOLE_DOMAIN_DNS> \
    S3_CONSOLE_URL=https://<S3_CONSOLE_DOMAIN_DNS> \
    docker compose up --build -d
```
run the file in the terminal

```shell
 ./prod-server.sh
```

or execute ```make prod```

**_NOTE:_** If when executing it gives any permissions problem, execute the following command

```shell
chmod +x [local, dev, prod]-server.sh
```

Once you have created local-server.sh and run the ```make local``` or ```make prod``` command, you must run ```make migrate``` to run the project migrations and ```make seed``` to create the first data

### Main commands:
```bash
# development
$ make dev

# production mode
$ make prod

# down containers
$ make down

# stop containers
$ make stop

# run migrations
$ make migrate

# run seeds
$ make seed
```

### Makefile file config

create a new `config.mk` file, copy and paste the variables that are in the example and modify it to your liking
```makefile
PROJECT_NAME=testproject

TLS=false
ENTRYPOINT=http

#ACME_STAGING=true
ACME_EMAIL=user@baserepository.com

PROXY_DOMAIN=proxy.localhost
LOAD_USERS ?= 'nodebaserepository:$$apr1$$RTZSd6uA$$9zpPRgArFsHX2UWgPNXL..'
APPLY_REDIRECT ?= false

DB_USER=baserepository
DB_NAME=baserepository
DB_PASSWORD=baserepository

S3_USER=baserepository
S3_PASSWORD=baserepository
S3_DOMAIN=s3.localhost
S3_URL=http://s3.localhost
S3_CONSOLE_DOMAIN=s3.localhost
S3_CONSOLE_URL=http://s3.localhost
S3_CONSOLE_PATH=/minio/ui/

REDIS_PASSWORD=baserepository

STAGE=dev

API_PORT=3000
API_DOMAIN=api.localhost
API_DOC_DOMAIN=doc.api.localhost

```

## UNIT TESTS
___

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov

# test coverage
$ pnpm run test:cov:check
```

## URL PANEL
___

* [Traefick](http://proxy.localhost)
* [S3Panel](http://s3.localhost)
* [S3](http://s3.localhost)
* [Mail](http://mail.localhost)
* [Doc](http://doc.api.localhost)

---
**_NOTE:_** Generate password load balancer
```shell
echo $(htpasswd -nb user password) | sed -e s/\\$/\\$\\$/g
```
