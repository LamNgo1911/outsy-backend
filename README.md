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
- [Testing](#testing)
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

-   `POST /api/v1/auth/signup`: Registers a new user.
-   `POST /api/v1/auth/login`: Logs in an existing user.
-   `POST /api/v1/auth/refresh-token`: Refreshes the authentication token.
-   `GET /api/v1/auth/verify`: Verifies the authentication token.
-   `POST /api/v1/auth/logout`: Logs out the user.
-   `PATCH /api/v1/auth/users/:userId/role`: Updates the role of a user (admin only).

### User Routes (`userRoutes.ts`)

-   `GET /api/v1/users/:id`: Retrieves a user by ID.
-   `PUT /api/v1/users/:id`: Updates a user.
-   `PATCH /api/v1/users/:id/password`: Updates a user's password.
-   `PATCH /api/v1/users/:id/online-status`: Toggles a user's online status.
-   `GET /api/v1/users/:userId/stats`: Retrieves user statistics.
-   `PATCH /api/v1/users/:userId/preferences`: Updates user preferences.
-   `GET /api/v1/users/search/:location/:interests/:excludeId`: Searches for users for a hangout.
-   `GET /api/v1/users/`: Retrieves all users (admin only).
-   `DELETE /api/v1/users/:id`: Deletes a user (admin only).

### Event Routes (`eventRoutes.ts`)

-   `GET /api/v1/events/`: Retrieves all events.
-   `GET /api/v1/events/:eventId`: Retrieves an event by ID.
-   `POST /api/v1/events/`: Creates a new event.
-   `PUT /api/v1/events/:eventId`: Updates an event.
-   `DELETE /api/v1/events/:eventId`: Deletes an event.

### Chat Routes (`chatRoutes.ts`)

-   `POST /api/v1/chats/`: Creates a new chat.
-   `GET /api/v1/chats/`: Retrieves all chats with pagination and filtering.
-   `GET /api/v1/chats/:id`: Retrieves a chat by ID.
-   `PUT /api/v1/chats/:id`: Updates a chat.
-   `DELETE /api/v1/chats/:id`: Deletes a chat.

### Message Routes (`messageRoutes.ts`)

-   `POST /api/v1/messages/`: Sends a message.
-   `PUT /api/v1/messages/`: Marks messages as read.
-   `GET /api/v1/messages/:chatId`: Retrieves messages by chat ID.

### Feedback Routes (`feedbackRoutes.ts`)

-   `POST /api/v1/feedbacks/`: Creates a new feedback.
-   `GET /api/v1/feedbacks/received/:userId`: Retrieves feedback received by a user.
-   `GET /api/v1/feedbacks/given/:giverId`: Retrieves feedback given by a user.
-   `PUT /api/v1/feedbacks/:id`: Updates feedback.
-   `DELETE /api/v1/feedbacks/:id`: Deletes feedback.

### UserChat Routes (`userChatRoutes.ts`)

-   `POST /api/v1/userchats/`: Adds a user to a chat.
-   `DELETE /api/v1/userchats/`: Removes a user from a chat.
-   `GET /api/v1/userchats/:chatId/users`: Retrieves all users in a chat.
-   `GET /api/v1/userchats/:userId/chats`: Retrieves all chats of a user.

### Venue Routes (`venueRoutes.ts`)

-   `GET /api/v1/venues/`: Retrieves all venues.
-   `GET /api/v1/venues/:id`: Retrieves a venue by ID.
-   `POST /api/v1/venues/`: Creates a new venue.
-   `DELETE /api/v1/venues/:id`: Deletes a venue (admin only).
-   `PUT /api/v1/venues/:id`: Updates a venue (admin only).

### EventLike Routes (`eventLikeRoutes.ts`)

-   `GET /api/v1/eventlikes/`: Retrieves all liked events.
-   `GET /api/v1/eventlikes/all/:userId`: Retrieves all liked events for a specific user.
-   `GET /api/v1/eventlikes/:eventLikeId`: Retrieves a liked event by ID.
-   `POST /api/v1/eventlikes/`: Creates a new liked event.
-   `PUT /api/v1/eventlikes/:eventLikeId`: Updates the status of a liked event.
-   `DELETE /api/v1/eventlikes/:eventLikeId`: Deletes a liked event.

### Match Routes (`matchRoutes.ts`)

-   `POST /api/v1/matches/`: Creates a new match.
-   `GET /api/v1/matches/:matchId`: Retrieves a match by ID.
-   `GET /api/v1/matches/event/:eventId`: Retrieves matches by event ID.
-   `GET /api/v1/matches/user/:userId`: Retrieves matches by user ID.
-   `PUT /api/v1/matches/:matchId`: Updates a match.
-   `DELETE /api/v1/matches/:matchId`: Deletes a match.

## Testing

To run the tests, use the following command:

```bash
npm test
```

## Deployed Application

The application is deployed at: http://13.49.27.132:8000

## Contributing

Contributions are welcome! Please open a pull request with your changes.
