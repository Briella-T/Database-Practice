# User Management System

A full-stack web application for managing users with CRUD operations, search functionality, and sorting capabilities. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 12 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
4. **Internet connection** (for MongoDB Atlas)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Database-Practice
```

### 2. Install Dependencies

```bash
npm install express mongoose dotenv
```

### 3. Environment Configuration

1. Copy the environment template file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database
PORT=3051
```

### 4. Database Configuration

The application is configured to connect to MongoDB Atlas using environment variables. Make sure you have:
- A MongoDB Atlas account
- A cluster set up
- Database user credentials
- Network access configured (IP whitelist or allow all)

### 5. Start the Application

```bash
node app
```

### 6. Access the Application

Open your web browser and navigate to:
```
http://localhost:3051
```

## How to Use

### 1. View Users
- The application automatically loads and displays all users in a table format
- Shows total user count at the top

### 2. Add a New User
1. Click the "Add New User" button
2. Fill in the required fields (First Name, Last Name, Email, Age)
3. Click "Add User" to save

### 3. Search Users
- Use the search box to find users by first name or last name
- Search is case-insensitive and updates in real-time

### 4. Sort Users
1. Select a field to sort by (First Name, Last Name, Email, or Age)
2. Choose ascending or descending order
3. Click the "Sort" button

### 5. Edit a User
1. Click the "Edit" button next to any user
2. Modify the information in the modal that opens
3. Click "Update User" to save changes

### 6. Delete a User
1. Click the "Delete" button next to any user
2. Confirm the deletion in the popup
3. The user will be permanently removed

## API Endpoints

The application provides the following REST API endpoints:

- `GET /api/users` - Get all users (supports query parameters for search and sort)
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a specific user by ID
- `PUT /api/users/:id` - Update a user by ID
- `DELETE /api/users/:id` - Delete a user by ID

### Query Parameters for GET /api/users:
- `search`: Search term for first name or last name
- `sort`: Field to sort by (firstName, lastName, email, age)
- `order`: Sort order (asc, desc)

Example: `GET /api/users?search=john&sort=firstName&order=desc`
