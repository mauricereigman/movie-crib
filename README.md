## Description

tv-maze import application used to import a dataset from tvmaze and store in in a postgress database and provide services for retrieving imported data

## Installation
### node project
```bash
$ npm install
```

## Running the app
```bash
$ docker-compose up -d
```
```bash
$ docker-compose down -v
```
#### navigate to localhost:8081/api

### local for dev mode

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### navigate to localhost:3000/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
  
