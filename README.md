# CRUD_API Implementation Integrated with Xata Database

This project demonstrates a basic **CRUD API** using **Express.js** and **TypeScript**, integrated with the **Xata database**. The API allows for creating, reading, updating, and deleting user records, utilizing Xata's NoSQL data store.
Testing of various endpoints within the project has been achieved using Postman.

## Features

- **Create** new users: Add new user records with `displayName` and `userName`.
- **Read** user records: Retrieve a list of all users or fetch details of a specific user by ID.
- **Update** existing users: Modify user information using `PUT` (replace all fields) or `PATCH` (update specific fields).
- **Delete** users: Remove a user from the database by ID.
- Error handling and validation included.
- Integrated with **Xata**, a serverless database, as the backend for data storage.

## Installation

Follow the steps below to set up and run the API on your local machine:

### Prerequisites

- [Node.js](https://nodejs.org/) installed (version 18+ recommended)
- [Xata account](https://xata.io/) with access to the API and database
- API key for Xata (set in the `.env` file)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Davey0076/CRUD_API-XATA_db.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```
    or
   ```bash
   pnpm install
   ```

4. **Set up environment variables:**

    Create a `.env` file in the project root and add the following environment variables:

    ```
    PORT=3000
    XATA_API_KEY=your_xata_api_key_here
    XATA_BRANCH = name_of_branch_in_use within_the_db
    ```

5. **Start the server:**

    Run the following command to start the server:

    ```bash
    npm run dev
    ```

    The API should now be running on `http://localhost:3000`.

## Endpoints

- **GET** `/api/v1/users` - Fetch all users.
- **GET** `/api/v1/users/:id` - Fetch a specific user by ID.
- **POST** `/api/v1/users` - Create a new user.
- **PUT** `/api/v1/users/:id` - Replace an existing user.
- **PATCH** `/api/v1/users/:id` - Update fields of a specific user.
- **DELETE** `/api/v1/users/:id` - Delete a specific user by ID.

## Screenshots

### 1. Fetch All Users


### 2. Create a New User


### 3. Fetch a Specific User


### 4. Update a User


### 5. Delete a User


