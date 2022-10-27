## Description

The application is a simple to use task manager

### Tech stack:

Nestjs, Postgres, TypeORM

### Requirements:

- Node version 16

- NPM
- PostgreSQL

## Installation the App locally:

```bash
# https:
git clone https://vadzimdzianisik@bitbucket.org/cogniteq-web/vadzimdzianisik.git
# or ssh
git clone git@bitbucket.org:cogniteq-web/vadzimdzianisik.git
```

### I. Running the App locally:

1. cd into `vadzimdzianisik`

2. run `npm install`

3. set up your postgres database

```bash
# create db
CREATE DATABASE intern1;
# create user name;
CREATE USER intern1 WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE intern1 TO intern1;
```

4. rename `.env.sample` to `.development.env` and fill the required parameters

```bash
URL_HOST=http://localhost:3000
URL_PREFIX_PATH=api/v1

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=intern1
POSTGRES_PASSWORD=1234
POSTGRES_DB=intern1

JWT_ACCESS_TOKEN_SECRET=accesstoken
JWT_ACCESS_TOKEN_EXPIRATION_TIME=172800
JWT_REFRESH_TOKEN_SECRET=refreshtoken
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800
```

5. run migrations `npm run db:migrate`

6. run seeds `npm run db:seed`

7. run app on dev mode:

```bash
# watch mode
$ npm run start:dev
```

8. run tests:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

9. run documentation

```bash
# compodoc
$ npm run compodoc
# swagger available by url
http://localhost:3000/api/v1/swagger
```

### II. Running the App on the remote server:

1. connect to the remote server via ssh
2. cd project/vadzimdzianisik
3. run app on dev mode:

```bash
# watch mode
$ npm run start
```

4. run tests:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

5. run documentation

```bash
# compodoc
$ npm run compodoc
# swagger available by url
https://intern1.dev2.cogniteq.com/api/v1/swagger
```

#### Stay in touch

- Author - Vadzim Dzianisik
