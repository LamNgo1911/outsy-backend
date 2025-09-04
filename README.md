Outsy Backend

The Outsy backend is a REST API built with Node.js, TypeScript, and Express, providing the core logic and data management for the Outsy application. It handles user authentication, event management, chat functionality, feedback collection, user matching, and venue management. The backend uses Prisma ORM to interact with a PostgreSQL database, and supports Docker deployment and CI/CD to AWS EC2.

## Features

- User authentication with JWT (access & refresh tokens)
- Prisma ORM for PostgreSQL database
- Event, Match, Chat, and Feedback management
- Dockerized for easy deployment
- CI/CD-ready GitHub Actions workflow

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Docker](#docker)
- [Deployment](#deployment)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Prerequisites

- Node.js (version >= 18)
- PostgreSQL
- Docker (optional, for Docker deployment)

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection string
- `JWT_ACCESS_SECRET`: Secret key for JWT access tokens
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens
- `ACCESS_TOKEN_EXPIRATION`: Access token expiration time
- `REFRESH_TOKEN_EXPIRATION`: Refresh token expiration time
- `NODE_ENV`: Environment mode (development, production)

## Installation

1. Clone the repository:

```bash
git clone git@github.com:LamNgo1911/outsy-backend.git
```

2. Navigate to the project directory:

```bash
cd outsy-backend
```

3. Install dependencies:

```bash
npm install
```

## Running Locally

1. Set up the database (see "Database" section).
2. Configure environment variables in `.env` file.
3. Run the development server:

```bash
npm run dev
```

## Docker

1. Build the Docker image:

```bash
docker build -t your-dockerhub-username/outsy:latest .
```

2. Run the Docker container:

```bash
docker run -d -p 8000:8000 your-dockerhub-username/outsy:latest
```

## Deployment

The backend is configured for CI/CD to AWS EC2 using GitHub Actions. The workflow is defined in `.github/workflows/deploy.yml`.

To configure deployment:

1. Set up an EC2 instance with Docker installed.
2. Configure the necessary secrets in your GitHub repository:
    - `DOCKERHUB_USERNAME`
    - `DOCKERHUB_PASSWORD`
    - `EC2_HOST`
    - `EC2_USER`
    - `EC2_SSH_KEY`
    - `JWT_ACCESS_SECRET`
    - `JWT_REFRESH_SECRET`
    - `DATABASE_URL`
    - `ACCESS_TOKEN_EXPIRATION`
    - `REFRESH_TOKEN_EXPIRATION`

## Database

The backend uses Prisma ORM to interact with a PostgreSQL database.

1.  Create a PostgreSQL database.
2.  Set the `DATABASE_URL` environment variable to your database connection string in `.env` file.
3.  Run Prisma migrations:

    ```bash
    npx prisma migrate dev
    ```

4.  Seed the database (optional):

    ```bash
    npm run seed
    ```

## API Endpoints

### Authentication Routes (`authRoutes.ts`)

-   `POST /signup`: Registers a new user.
-   `POST /login`: Logs in an existing user.
-   `POST /refresh-token`: Refreshes the authentication token.
-   `GET /verify`: Verifies the authentication token.
-   `POST /logout`: Logs out the user.
-   `PATCH /users/:userId/role`: Updates the role of a user (admin only).

### Chat Routes (`chatRoutes.ts`)

-   `POST /`: Creates a new chat.
-   `GET /`: Retrieves all chats with pagination and filtering.
-   `GET /:id`: Retrieves a chat by ID.
-   `PUT /:id`: Updates a chat.
-   `DELETE /:id`: Deletes a chat.

### EventLike Routes (`eventLikeRoutes.ts`)

-   `GET /`: Retrieves all liked events.
-   `GET /all/:userId`: Retrieves all liked events for a specific user.
-   `GET /:eventLikeId`: Retrieves a liked event by ID.
-   `POST /`: Creates a new liked event.
-   `PUT /:eventLikeId`: Updates the status of a liked event.
-   `DELETE /:eventLikeId`: Deletes a liked event.

### Event Routes (`eventRoutes.ts`)

-   `GET /`: Retrieves all events.
-   `GET /:eventId`: Retrieves an event by ID.
-   `POST /`: Creates a new event.
-   `PUT /:eventId`: Updates an event.
-   `DELETE /:eventId`: Deletes an event.

### Feedback Routes (`feedbackRoutes.ts`)

-   `POST /`: Creates a new feedback.
-   `GET /received/:userId`: Retrieves feedback received by a user.
-   `GET /given/:giverId`: Retrieves feedback given by a user.
-   `PUT /:id`: Updates feedback.
-   `DELETE /:id`: Deletes feedback.

### Match Routes (`matchRoutes.ts`)

-   `POST /`: Creates a new match.
-   `GET /:matchId`: Retrieves a match by ID.
-   `GET /event/:eventId`: Retrieves matches by event ID.
-   `GET /user/:userId`: Retrieves matches by user ID.
-   `PUT /:matchId`: Updates a match.
-   `DELETE /:matchId`: Deletes a match.

### Message Routes (`messageRoutes.ts`)

-   `POST /`: Sends a message.
-   `PUT /`: Marks messages as read.
-   `GET /:chatId`: Retrieves messages by chat ID.

### UserChat Routes (`userChatRoutes.ts`)

-   `POST /`: Adds a user to a chat.
-   `DELETE /`: Removes a user from a chat.
-   `GET /:chatId/users`: Retrieves all users in a chat.
-   `GET /:userId/chats`: Retrieves all chats of a user.

### User Routes (`userRoutes.ts`)

-   `GET /:id`: Retrieves a user by ID.
-   `PUT /:id`: Updates a user.
-   `PATCH /:id/password`: Updates a user's password.
-   `PATCH /:id/online-status`: Toggles a user's online status.
-   `GET /:userId/stats`: Retrieves user statistics.
-   `PATCH /:userId/preferences`: Updates user preferences.
-   `GET /search/:location/:interests/:excludeId`: Searches for users for a hangout.
-   `GET /`: Retrieves all users (admin only).
-   `DELETE /:id`: Deletes a user (admin only).

### Venue Routes (`venueRoutes.ts`)

-   `GET /`: Retrieves all venues.
-   `GET /:id`: Retrieves a venue by ID.
-   `POST /`: Creates a new venue.
-   `DELETE /:id`: Deletes a venue (admin only).
-   `PUT /:id`: Updates a venue (admin only).

## Deployed Application

The application is deployed at: http://13.49.27.132:8000/api/v1

## Contributing

Contributions are welcome! Please open a pull request with your changes.
