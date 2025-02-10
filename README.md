project:
  name: "NestJS Weather API"
  description: "A production-ready NestJS application integrating OpenWeatherMap API with authentication, caching, rate limiting, and background jobs."
  features:
    - NestJS Modular Architecture
    - REST & GraphQL Support
    - Authentication (JWT)
    - Rate Limiting
    - Caching (Redis)
    - Background Jobs (Weather Updates)
    - Logging & Error Handling
    - 100% Test Coverage with Jest

setup:
  steps:
    - step: "Install Dependencies"
      command: "npm install"
    
    - step: "Set Up Environment Variables"
      file: ".env"
      content:
        PORT: 3000
        OPENWEATHER_API_KEY: "your_openweathermap_api_key"
        JWT_SECRET: "your_secret"
        REDIS_HOST: "localhost"
        REDIS_PORT: 6379
        POSTGRES_HOST: "localhost"
        POSTGRES_PORT: 5432
        POSTGRES_USER: "postgres"
        POSTGRES_PASSWORD: "your_password"
        POSTGRES_DB: "weatherdb"

    - step: "Run PostgreSQL & Redis (Docker)"
      command: "docker-compose up -d"

    - step: "Run Database Migrations"
      command: "npm run typeorm migration:run"

    - step: "Start the Server"
      command: "npm run start"

    - step: "API Documentation"
      links:
        - REST API (Swagger): "http://localhost:3000/docs"
        - GraphQL Playground: "http://localhost:3000/graphql"

api:
  rest:
    - endpoint: "/weather/:city"
      method: "GET"
      description: "Retrieve current weather for a city."
      response:
        city: "New York"
        temperature: 25
        humidity: 80
        description: "Cloudy"

    - endpoint: "/forecast/:city"
      method: "GET"
      description: "Retrieve a 5-day weather forecast."

    - endpoint: "/locations"
      method: "POST"
      description: "Add a location to the user's favorites."
      request:
        city: "London"

    - endpoint: "/locations"
      method: "GET"
      description: "Retrieve the user's favorite locations."

    - endpoint: "/locations/:id"
      method: "DELETE"
      description: "Remove a location from favorites."

  graphql:
    - query:
        name: "weather"
        description: "Get current weather for a city."
        syntax: |
          query {
            weather(city: "Paris") {
              city
              temperature
              description
            }
          }

    - mutation:
        name: "addFavorite"
        description: "Add a city to favorites."
        syntax: |
          mutation {
            addFavorite(userId: 1, city: "Berlin") {
              id
              city
            }
          }

    - mutation:
        name: "removeFavorite"
        description: "Remove a favorite city."
        syntax: |
          mutation {
            removeFavorite(id: 2)
          }

authentication:
  type: "JWT (JSON Web Token)"
  obtain_token:
    method: "POST"
    endpoint: "/auth/login"
  usage:
    header: "Authorization: Bearer <TOKEN>"

caching:
  strategy:
    - "Weather data is cached in Redis for 30 minutes."
    - "Favorite locations fetch fresh data on every request."

rate_limiting:
  limit: "60 requests per minute"
  exceeded_response: "HTTP 429 Too Many Requests"

testing:
  commands:
    - "Run Tests: npm run test"
    - "Check Coverage: npm run test:cov"

license:
  type: "MIT License"
