# User Management System

A full-stack web application for managing users with CRUD operations, search functionality, and sorting capabilities. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### Required Features ✅
- **User Attributes**: Each user has User ID, First Name, Last Name, Email Address, and Age
- **Add New User**: Create new users with form validation
- **Edit User**: Modify existing user information
- **Delete User**: Remove users with confirmation
- **Alphabetical Sorting**: Sort users by any attribute in ascending or descending order
- **Search Functionality**: Search users by first name and/or last name
- **Database Persistence**: All data is stored in MongoDB Atlas and persists between sessions

### Additional Features
- Responsive design for mobile and desktop
- Real-time search with debouncing
- Professional styling and user interface
- Error handling and validation
- Auto-generated unique user IDs
- Environment variable configuration for security

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **ODM**: Mongoose
- **Environment**: dotenv

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

**⚠️ Important**: Never commit the `.env` file to version control. It contains sensitive information and is already included in `.gitignore`.

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

## File Structure

```
/
├── .env                    # Environment variables (not in git)
├── .env.example           # Environment template
├── .gitignore             # Git ignore file
├── app.js                 # Main server file with API routes
├── package.json           # npm dependencies and project info
├── README.md              # This file
└── public/
    ├── index.html         # Frontend HTML
    └── script.js          # Frontend JavaScript
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mtec` |
| `PORT` | Server port | `3051` |

## Security

- **Environment Variables**: Sensitive data like database credentials are stored in `.env` file
- **gitignore**: The `.env` file is excluded from version control
- **Input Validation**: All user inputs are validated on both client and server side
- **Error Handling**: Proper error messages without exposing system details

## Troubleshooting

### Common Issues

1. **"node app" not working**
   - Make sure you're in the correct directory
   - Ensure all dependencies are installed: `npm install`
   - Check if port 3051 is already in use

2. **Database connection issues**
   - Verify your `.env` file contains the correct MongoDB URI
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check your database user credentials

3. **Environment variables not loading**
   - Make sure the `.env` file exists in the project root
   - Verify the file format (no spaces around the `=` sign)
   - Restart the server after changing environment variables

## Assignment Requirements Checklist

- ✅ User attributes: User ID, First Name, Last Name, Email, Age
- ✅ Can add a new user
- ✅ Can edit an existing user
- ✅ Can delete a user
- ✅ Can sort users alphabetically (ascending and descending) by multiple attributes
- ✅ Can search users by first name and/or last name
- ✅ Instructions on how to start the application
- ✅ All users stored in MongoDB Atlas
- ✅ Frontend makes proper API calls to Node.js server
- ✅ Data persists between start/stop cycles
- ✅ Clean and readable styling
- ✅ Environment variables for security

## Support

If you encounter any issues or have questions about the application, please check:
1. The console output for error messages
2. Your MongoDB Atlas connection settings
3. The troubleshooting section above

For development questions, ensure all prerequisites are met and environment variables are properly configured.