# Rich Challenge

## Table of Contents

- [Rich Challenge](#rich-challenge)
  - [Table of Contents](#table-of-contents)
  - [Getting Started - Local Development](#getting-started---local-development)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
  - [Available Scripts](#available-scripts)
    - [`yarn start:dev`](#yarn-startdev)
    - [`yarn test`](#yarn-test)
    - [`yarn build`](#yarn-build)
  - [GraphQL Playground](#graphql-playground)
  - [Environment Variables:](#environment-variables)

## Getting Started - Local Development

### Prerequisites

Make sure you have the following installed on your system:

- Node.js 20 or later
- npm (comes with Node.js) or yarn
- Docker

### Clone the Repository

1. Open your terminal.
2. Run the following command to clone the repository:
   ```
   git clone https://github.com/quang-pham-dev/rich-challenge.git
   ```
3. Navigate to the project directory:
   ```
   cd rich-challenge
   ```

## Available Scripts

In the project root directory, you can run:

### `yarn start:dev`

Runs the app in development mode.
By default, it is accessible at http://localhost:8080

### `yarn test`

Runs tests.

### `yarn build`

Builds the app for production in the `dist` folder.

Your app is ready to be deployed!

## GraphQL Playground

To access the GraphQL Playground:

1. Ensure the application is running (use `yarn start:dev` for development mode).
2. Open your web browser and navigate to `http://localhost:8080/graphql`.
3. You should now see the GraphQL Playground interface where you can explore the API, write queries, and test mutations.

Note: Make sure the `GRAPHQL_PLAYGROUND` environment variable is set to `true` to enable the playground in your environment.

## Environment Variables:

| Environment            | Description                              | Value                                                   |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------- |
| PORT                   | The port that the server is listening to | 8080                                                    |
| DATABASE_URL           | Database connection URL                  | postgresql://user:password@localhost:5432/your_database |
| JWT_ACCESS_SECRET      | JWT access token secret                  | your_access_secret                                      |
| JWT_ACCESS_EXPIRATION  | JWT access token expiration              | 15m                                                     |
| JWT_REFRESH_SECRET     | JWT refresh token secret                 | your_refresh_secret                                     |
| JWT_REFRESH_EXPIRATION | JWT refresh token expiration             | 7d                                                      |
| GRAPHQL_PLAYGROUND     | Enable GraphQL playground                | true                                                    |
| GRAPHQL_INTROSPECTION  | Enable GraphQL introspection             | true                                                    |
