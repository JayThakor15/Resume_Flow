# Resume Builder Backend

A robust Node.js/Express.js backend API for the Resume Builder platform, featuring secure authentication, comprehensive resume management, and MongoDB integration.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Resume Management**: Full CRUD operations with versioning and duplication
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet.js security headers, rate limiting, and CORS protection
- **Error Handling**: Centralized error handling with detailed error messages
- **Logging**: HTTP request logging with Morgan
- **Database**: MongoDB with Mongoose ODM for flexible data modeling

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logger
- **express-rate-limit**: Rate limiting

## Project Structure

```
backend/
├── controllers/        # Route controllers
│   ├── authController.js    # Authentication logic
│   └── resumeController.js  # Resume management logic
├── models/            # Database models
│   ├── User.js        # User schema
│   └── Resume.js      # Resume schema
├── routes/            # API routes
│   ├── auth.js        # Authentication routes
│   └── resumes.js     # Resume routes
├── middleware/        # Custom middleware
│   ├── auth.js        # JWT authentication middleware
│   └── errorHandler.js # Error handling middleware
├── utils/             # Utility functions
├── package.json       # Dependencies and scripts
├── server.js          # Server entry point
└── .env               # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/resume-builder
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

### Database Setup

1. **Local MongoDB**:

   - Install MongoDB locally
   - Start MongoDB service
   - Create database: `resume-builder`

2. **MongoDB Atlas**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get connection string and update `MONGODB_URI`

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:5000`

### Production Deployment

1. Set environment variables for production
2. Start the production server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run test suite

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET /api/auth/me

Get current user information (requires authentication).

**Headers:**

```
Authorization: Bearer jwt-token
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "lastLogin": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/auth/profile

Update user profile (requires authentication).

**Headers:**

```
Authorization: Bearer jwt-token
```

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### PUT /api/auth/password

Change user password (requires authentication).

**Headers:**

```
Authorization: Bearer jwt-token
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Resume Endpoints

#### GET /api/resumes

Get all resumes for the authenticated user.

**Headers:**

```
Authorization: Bearer jwt-token
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "resume-id",
      "title": "Software Developer Resume",
      "version": 1,
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/resumes/:id

Get a specific resume by ID.

**Headers:**

```
Authorization: Bearer jwt-token
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "resume-id",
    "title": "Software Developer Resume",
    "version": 1,
    "isActive": true,
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, State"
    },
    "education": [...],
    "experience": [...],
    "skills": [...],
    "projects": [...],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/resumes

Create a new resume.

**Headers:**

```
Authorization: Bearer jwt-token
```

**Request Body:**

```json
{
  "title": "My Resume",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "education": [...],
  "experience": [...],
  "skills": [...],
  "projects": [...]
}
```

#### PUT /api/resumes/:id

Update an existing resume.

**Headers:**

```
Authorization: Bearer jwt-token
```

**Request Body:** (Same as POST)

#### DELETE /api/resumes/:id

Delete a resume.

**Headers:**

```
Authorization: Bearer jwt-token
```

#### GET /api/resumes/:id/versions

Get all versions of a specific resume.

#### POST /api/resumes/:id/duplicate

Create a duplicate of a resume.

#### PUT /api/resumes/:id/toggle

Toggle the active status of a resume.

## Data Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Model

```javascript
{
  user: ObjectId (ref: User),
  title: String,
  version: Number,
  isActive: Boolean,
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  skills: [{
    name: String,
    level: String,
    category: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  languages: [{
    name: String,
    proficiency: String
  }],
  template: String,
  settings: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive validation for all inputs
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for frontend communication
- **Error Handling**: Secure error messages without sensitive data

## Error Handling

The API uses a centralized error handling system:

- **Validation Errors**: Detailed field-specific error messages
- **Authentication Errors**: Clear unauthorized access messages
- **Database Errors**: Handled gracefully with user-friendly messages
- **JWT Errors**: Proper token validation and expiration handling

## Environment Variables

| Variable       | Description               | Default               |
| -------------- | ------------------------- | --------------------- |
| `PORT`         | Server port               | 5000                  |
| `NODE_ENV`     | Environment mode          | development           |
| `MONGODB_URI`  | MongoDB connection string | -                     |
| `JWT_SECRET`   | JWT signing secret        | -                     |
| `JWT_EXPIRE`   | JWT expiration time       | 30d                   |
| `FRONTEND_URL` | Frontend URL for CORS     | http://localhost:3000 |

## Deployment

### Render

1. Connect your repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables
5. Deploy

### Heroku

1. Create Heroku app
2. Set buildpacks for Node.js
3. Configure environment variables
4. Deploy using Git

### Railway

1. Connect your repository to Railway
2. Configure environment variables
3. Deploy automatically

## Contributing

1. Follow the existing code style and patterns
2. Add proper error handling and validation
3. Write tests for new features
4. Update API documentation
5. Ensure security best practices

## License

This project is licensed under the MIT License.
