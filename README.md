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

MINIO_EXPOSE_HOST=s3.localhost
MINIO_EXPOSE_HTTPS=false
MINIO_HOST=s3
MINIO_ACCESS_KEY=baserepository
MINIO_SECRET_KEY=baserepository
MINIO_USE_SSL=false
MINIO_PORT=9000
MINIO_PUBLIC_BUCKET=baserepository
MINIO_PRIVATE_BUCKET=baserepository
MINIO_ROOT_PATH=data
MINIO_REGION=us-east-1
MINIO_SIGN_EXPIRE=9000

OTP_CODE_EXPIRE=10m
OTP_LIMIT_ATTEMPTS=20
OTP_TASK_RESTARTING_ATTEMPTS='0 0 * * *'

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

```

## START UP
___

### Local Server Intranet
Create file `local-server.sh` in root project

```shell
#!/bin/bash
STAGE=dev \
    API_PORT=4000 \
    API_DOMAIN=<YOUR_IP>:4000 \
    S3_API_DOMAIN=<YOUR_IP>:9000 \
    S3_PANEL_DOMAIN=<YOUR_IP>:9001 \
    LOAD_DOMAIN=<YOUR_IP> \
    docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build -d
```
run the file in the terminal

### Production Server
Create file `prod-server.sh` in root project

```shell
#!/bin/bash

docker compose down && \
    sh volume.sh && \
    STAGE=prod \
    API_PORT=4000 \
    TLS=true \
    ENTRYPOINT=https \
    API_DOMAIN=<YOUR_DAMIN> \
    S3_API_DOMAIN=<YOUR_DAMIN> \
    S3_PANEL_DOMAIN=<YOUR_DAMIN> \
    LOAD_DOMAIN=<YOUR_DAMIN> \
    APPLY_REDIRECT=true \
    PROJECT_NAME=<NAME> \
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

* [Traefick](http://load.localhost)
* [S3Panel](http://panel.s3.localhost)
* [S3](http://s3.localhost)
* [Mail](http://mail.localhost)
* [Doc](http://doc.api.localhost)

---
**_NOTE:_** Generate password load balancer
```shell
echo $(htpasswd -nb user password) | sed -e s/\\$/\\$\\$/g
```
