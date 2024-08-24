## Description

This is the assignment for the Scentronix backend test, which involves implementing a backend service using TypeScript to return reachable URLs, either ordered by priority or by querying a specific priority number. This setup uses a NestJS monorepo.

- **project-root/**
  - **apps/**: Store different applications, such as microservices or workers, which can reuse functionalities from the libraries defined in the libs/ directory.
    - **scentronix-backend/**: The main app.
  - **libs/**: Define functionalities that can be shared between applications.
    - **config/**: Store all app configurations that are not related to business rules.
      - **app-cache/**: Set up the cache layer using Redis.
      - **app-config/**: Configure all application values from environment variables using the NestJS Config Module.
      - **mock-data/**: Set up a mock data service that returns URLs and their priorities.
    - **use-case/**: Store all business-related modules.
      - **url-status/**: Check URL availability status: first query the cache, and if values are not found, call the API directly.
      - **urls-by-priority/**: Return reachable URLs ordered by priority, with 1 being the highest.
      - **urls-by-specific-priority/**: Return reachable URLs by querying a specific priority number.

## Setup

```bash
# install
$ yarn install --frozen-lockfile

# setup external services with docker compose
$ docker compose up --build -d

# setup external services with docker (if not use docker compose)
$ docker run --name redis -p 6379:6379 -e REDIS_PASSWORD=redis_123 -d redis redis-server --requirepass redis_123

# setup env
$ cp .env.example .env

# start server
$ yarn start:dev

# unit test
$ yarn test

# unit test coverage
$ yarn test:cov

# e2e test
$ yarn test:e2e
```

## Usage

- Postman: Visit http://localhost:3000 and use the endpoints /urls or /urls/{priority}.
- Swagger: Visit http://localhost:3000/api. You can test the APIs directly from Swagger by clicking the `Try it out` button.
- The initial query may be slow because the request checks the server's availability and times out after 5 seconds. Subsequent queries will be faster as the server status is cached in Redis.
- After 5 minutes, the server status will be removed from Redis, and a new request will be made to check the server's availability again.
