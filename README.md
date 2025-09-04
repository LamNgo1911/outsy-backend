# Outsy Backend

## Table of Contents

-   [Description](#description)
-   [Technologies Used](#technologies-used)
-   [Project Structure](#project-structure)
-   [Database Schema](#database-schema)
-   [API Endpoints](#api-endpoints)
    -   [Authentication Routes](#authentication-routes-authroutes)
    -   [Chat Routes](#chat-routes-chatroutes)
    -   [EventLike Routes](#eventlike-routes-eventlikeroutes)
    -   [Event Routes](#event-routes-eventroutes)
    -   [Feedback Routes](#feedback-routes-feedbackroutes)
    -   [Match Routes](#match-routes-matchroutes)
    -   [Message Routes](#message-routes-messageroutes)
    -   [UserChat Routes](#userchat-routes-userchatroutes)
    -   [User Routes](#user-routes-userroutes)
    -   [Venue Routes](#venue-routes-venueroutes)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [Running the Application](#running-the-application)
-   [Testing](#testing)
-   [Environment Variables](#environment-variables)
-   [Contributing](#contributing)
-   [License](#license)

# Outsy Backend

## Description

The Outsy backend is a REST API built with Node.js, Express, and Prisma, providing the core logic and data management for the Outsy application. It handles user authentication, event management, chat functionality, and more.

## Technologies Used

-   Node.js
-   Express
-   Prisma
-   TypeScript
-   PostgreSQL
-   Jest (for testing)

## Project Structure

The backend project is structured as follows:

-   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
-   `jest.config.js`: Configuration file for Jest testing framework.
-   `package-lock.json`: Records the exact versions of dependencies used in the project.
-   `package.json`: Contains metadata about the project, including dependencies and scripts.
-   `tsconfig.json`: Configuration file for the TypeScript compiler.
-   `prisma/`: Contains the Prisma schema and migrations.
    -   `schema.prisma`: Defines the database schema.
    -   `seed.ts`: Seeds the database with initial data.
-   `src/`: Contains the source code for the application.
    -   `app.ts`: Main application file.
    -   `server.ts`: Entry point for the server.
    -   `config/`: Contains configuration files.
        -   `prisma.ts`: Configures the Prisma client.
    -   `controllers/`: Contains the route handlers.
        -   `authController.ts`: Handles authentication logic.
        -   `chatController.ts`: Handles chat logic.
        -   `eventController.ts`: Handles event logic.
        -   `eventLikeController.ts`: Handles event like logic.
        -   `feedbackController.ts`: Handles feedback logic.
        -   `matchController.ts`: Handles match logic.
        -   `messageController.ts`: Handles message logic.
        -   `userChatController.ts`: Handles user chat logic.
        -   `userController.ts`: Handles user logic.
        -   `venueController.ts`: Handles venue logic.
    -   `error/`: Contains custom error classes.
        -   `apiError.ts`: Defines a custom API error class.
    -   `middlewares/`: Contains Express middlewares.
        -   `adminCheck.ts`: Checks if the user is an admin.
        -   `apiErrorHandler.ts`: Handles API errors.
        -   `authMiddleware.ts`: Authenticates users.
        -   `notFoundError.ts`: Handles 404 errors.
        -   `validateRequest.ts`: Validates request bodies.
    -   `routes/`: Contains the API routes.
        -   `authRoutes.ts`: Defines authentication routes.
        -   `chatRoutes.ts`: Defines chat routes.
        -   `eventRoutes.ts`: Defines event routes.
        -   `eventLikeRoutes.ts`: Defines event like routes.
        -   `feedbackRoutes.ts`: Defines feedback routes.
        -   `matchRoutes.ts`: Defines match routes.
        -   `messageRoutes.ts`: Defines message routes.
        -   `userChatRoutes.ts`: Defines user chat routes.
        -   `userRoutes.ts`: Defines user routes.
        -   `venueRoutes.ts`: Defines venue routes.
    -   `services/`: Contains the business logic.
        -   `authService.ts`: Handles authentication services.
        -   `chatService.ts`: Handles chat services.
        -   `eventService.ts`: Handles event services.
        -   `eventLikeService.ts`: Handles event like services.
        -   `feedbackService.ts`: Handles feedback services.
        -   `matchService.ts`: Handles match services.
        -   `messageService.ts`: Handles message services.
        -   `userChatService.ts`: Handles user chat services.
        -   `userService.ts`: Handles user services.
        -   `venueService.ts`: Handles venue services.
    -   `types/`: Contains TypeScript types.
        -   `types.ts`: Defines shared types.
    -   `utils/`: Contains utility functions.
        -   `generateAccessToken.ts`: Generates access tokens.
        -   `generateRefreshToken.ts`: Generates refresh tokens.
        -   `Result.ts`: Defines a result type for handling success/failure.
        -   `validation/`: Contains Zod schemas for validation.
            -   `chatSchema.ts`: Defines Zod schema for chat validation.
            -   `eventSchema.ts`: Defines Zod schema for event validation.
            -   `feedbackSchema.ts`: Defines Zod schema for feedback validation.
            -   `matchSchema.ts`: Defines Zod schema for match validation.
            -   `messageSchema.ts`: Defines Zod schema for message validation.
            -   `venueSchema.ts`: Defines Zod schema for venue validation.
-   `test/`: Contains the test files.
    -   `controllers/`: Contains the controller tests.
    -   `services/`: Contains the service tests.

## Database Schema

The database schema is defined using Prisma and includes the following models:

-   `User`: Stores user information.
-   `Preference`: Stores user preferences.
-   `RefreshToken`: Stores refresh tokens for users.
-   `Chat`: Stores chat rooms between users.
-   `UserChat`: Join table for the many-to-many relationship between User and Chat.
-   `Message`: Stores messages.
-   `Feedback`: Stores feedback given by users.
-   `Event`: Stores events created by users.
-   `EventLike`: Stores likes from users to events.
-   `Match`: Stores matches between users and events.
-   `Venue`: Stores venue information.

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

## Getting Started

### Prerequisites

-   Node.js (version >= 18)
-   PostgreSQL
-   Prisma CLI

### Installation

1.  Clone the repository:

    ```bash
    git clone git@github.com:LamNgo1911/outsy-backend.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd outsy-backend
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Set up the database:

    -   Create a PostgreSQL database.
    -   Set the `DATABASE_URL` environment variable to your database connection string in `.env` file.

5.  Run Prisma migrations:

    ```bash
    npx prisma migrate dev
    ```

6.  Seed the database (optional):

    ```bash
    npm run seed
    ```

### Running the Application

```bash
npm run dev
```

The server will start at `http://localhost:8000`.

## Testing

```bash
npm test
```

## Environment Variables

-   `DATABASE_URL`: PostgreSQL database connection string.
-   `NODE_ENV`: Environment mode (development, production, etc.).
-   `JWT_ACCESS_SECRET`: Secret key for signing JWT access tokens.
-   `JWT_REFRESH_SECRET`: Secret key for signing JWT refresh tokens.
-   `ACCESS_TOKEN_EXPIRATION`: Expiration time for access tokens.
-   `REFRESH_TOKEN_EXPIRATION`: Expiration time for refresh tokens.

## Contributing

Contributions are welcome! Please open a pull request with your changes.

## License

ISC
