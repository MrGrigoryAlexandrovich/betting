# Betting System with MongoDB, Redis, and BullMQ

This document provides an overview of the backend application, its API, and instructions on how to run it locally using Docker.

## Technical Implementation

The backend application utilizes a microservices-inspired architecture, leveraging the following technologies:

- **MongoDB:** A NoSQL database used for persistent data storage.
- **Redis:** An in-memory data store used for caching and session management, enhancing application performance.
- **BullMQ:** A robust queue system built on top of Redis, used for asynchronous task processing, particularly for handling payment and payout operations in a reliable manner.
- **Docker:** Containerization technology used to package the application and its dependencies for easy deployment and portability.

The application exposes a RESTful API with the base prefix `/api/`.

## API Documentation

The following endpoints are available:

### Swagger - `/api-docs`

### Tickets (`/api/tickets`)

- **`GET /list`**: Retrieves a list of tickets.
- **`POST /payment`**: Processes a payment request.
- **`PATCH /payout`**: Updates the status of a payout.

### Statistics (`/api/statistics`)

- **`GET /`**: Retrieves statistics with optional filtering and pagination.

  **Query Parameters:**

  - `page` (integer, optional): The page number for pagination (default: 1).
  - `size` (integer, optional): The number of items per page (default: 10).
  - `playerUsername` (string, optional): Filter statistics by player username.
  - `date` (string, optional): Filter statistics by a specific date (format: `DD-MM-YYYY`).
  - `hour` (integer, optional): Filter statistics by a specific hour (0-23).
  - `timezoneOffset` (integer, optional): Timezone offset in minutes.

  **Example:**

  ```
  http://localhost:9000/api/statistics?page=1&size=10&playerUsername=81d0f3e7-81dd-4c96-be73-d4d7015e17c7&date=23-04-2025&hour=10&timezoneOffset=1
  ```

### Leaderboard (`/api/leaderboard`)

- **`GET /`**: Retrieves the leaderboard data.

## Local Setup Instructions

To run the application locally, ensure you have Docker and Docker Compose installed on your system.

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone git@github.com:MrGrigoryAlexandrovich/betting.git
    cd betting
    ```

2.  **Configure the `.env` file (optional for testing):**

Specify the port (eg 9000), create an .env file in the root of your project directory (if it doesn't already exist) and add the following line:

    ```
    PORT=9000
    ```

    This will ensure the application runs on port `9000` if your Docker Compose configuration is set up to use this environment variable.

3.  **Build and start the Docker containers:**

    ```bash
    docker-compose build
    docker-compose up -d
    ```

    This command will build the Docker images and start the MongoDB, Redis, and application containers in detached mode, using the port specified in the `.env` file if configured.

4.  **Initialize the MongoDB Replica Set (after the first run):**

    After the initial startup, you need to initialize the MongoDB replica set for data redundancy and high availability.

    ```bash
    docker exec -it mongo1 mongosh
    ```

    Once inside the MongoDB shell, execute the following command:

    ```javascript
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "mongo1:27017" },
        { _id: 1, host: "mongo2:27017" },
        { _id: 2, host: "mongo3:27017" },
      ],
    });
    ```

    This will initialize a replica set named `rs0` with the three MongoDB containers.

5.  **Access the application:**

    The application should be accessible at `http://localhost:9000` (or the port specified in your `.env` file) You can then use the API endpoints documented above.

## Potential Issues and Workarounds

Sometimes, after the initial replica set initialization, you might encounter issues. If so, try the following:

1.  **Stop the Docker containers:**

    ```bash
    docker-compose down
    ```

2.  **Rebuild and restart the containers:**

    ```bash
    docker-compose build
    docker-compose up -d
    ```

This often resolves any initial connectivity or configuration issues with the replica set.

3.  **Enjoy**

---
