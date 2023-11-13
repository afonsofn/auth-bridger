# Auth-Bridger

## Description

Auth-Bridger is a authentication API, developed using NestJS with TypeScript. This project leverages the power of Passport.js for OAuth authentication, supporting Google and Facebook logins, as well as traditional email and password authentication. It utilizes Prisma for database interactions, with PostgreSQL as the underlying database.

The API is designed with security and scalability in mind, using JWT to handle the secure authentication and Redis to manage a list of logged-out tokens, ensuring efficient token invalidation. Additionally, the project is containerized with Docker and Docker Compose, simplifying deployment and environment setup.

## Technologies

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Passport.js](http://www.passportjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [JWT](https://jwt.io/)

## Getting Started

To get the project up and running on your local machine, follow these steps:

### Prerequisites

- Docker and Docker Compose
- Node.js

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:afonsofn/auth-bridger.git
   ```
2. Navigate to the project directory:
   ```bash
   cd auth-bridger
   ```
3. Start the Docker containers (PostgreSQL and Redis):
   ```bash
   npm run db:dev:start
   ```
4. Deploy Prisma migrations:
   ```bash
   npm run prisma:dev:deploy
   ```
5. Start the application:
   ```bash
   npm run start:dev
   ```

## Usage

The Auth-Bridger API provides several endpoints for handling user authentication and token management. Below are examples of how to use each route:

### User Registration (Logon)

- **Endpoint**: `POST /auth/logon`
- **Body**:
  ```json
  {
    "email": "john@doe.com",
    "password": "yourStrongPassword",
    "firstName": "John",
    "lastName": "Doe",
    "nickname": "Lil Joe"
  }
  ```
- **Response**: `On successful registration, a JWT is returned in the response cookies for authentication.`

### User Login

- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "john@doe.com",
    "password": "yourStrongPassword",
  }
  ```
- **Response**: `On successful registration, a JWT is returned in the response cookies for authentication.`

### Google OAuth Authentication

- **Initiate Authentication**: `GET /auth/google`
  - To begin authentication, open this URL in a browser. This will redirect the user to Google for authentication.
- **Callback Endpoint**: `GET /auth/google/callback`
  - Handles the response from Google.
- **Response**: `On successful registration, a JWT is returned in the response cookies for authentication.`

### Facebook OAuth Authentication

- **Initiate Authentication**: `GET /auth/facebook`
  - To begin authentication, open this URL in a browser. This will redirect the user to Facebook for authentication.
- **Callback Endpoint**: `GET /auth/facebook/callback`
  - Handles the response from Facebook.
- **Response**: `On successful registration, a JWT is returned in the response cookies for authentication.`

### User Logout

- **Endpoint**: `POST /auth/logout`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer yourJWTtoken"
  }
  ```

### Contributions are welcome :D