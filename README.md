## Description

tv-maze import application used to import a dataset from tvmaze and store in in a postgress database and provide services for retrieving imported data

## Installation
### node project
```bash
$ npm install
```

### db setup & start/stop
```bash
$ docker-compose up -d
```
```bash
$ docker-compose down -v
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
  
