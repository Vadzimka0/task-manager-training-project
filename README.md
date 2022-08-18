## Description

The application is a simple to use task manager

### Tech stack:

Nestjs, Postgres, TypeORM

### Requirements:

- Node version 16
- NPM
- PostgreSQL

### Installation:

```bash
# https:
git clone https://github.com/Vadzimka0/task-manager.git
# or ssh
git clone git@github.com:Vadzimka0/task-manager.git
```

### Running the app:

1. cd into `task-manager`

2. run `npm install`

3. set up your postgres database

```bash
# create db
CREATE DATABASE intern1;
# create user name;
CREATE USER intern1 WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE intern1 TO intern1;
```

4. rename `.env.sample` to `.env` and populate the required parameters

```bash
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

7. run app on dev or watch mode:

```bash
# watch mode
$ npm run start:dev

# development
$ npm run start

# production mode
$ npm run start:prod
```

### Stay in touch

- Author - Vadzim Dzianisik
