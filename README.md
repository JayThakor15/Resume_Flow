# Resume Builder Platform

A modern, full-stack resume builder application with secure authentication, version tracking, and PDF export capabilities.

## 🚀 Features

### Core Features

- **Secure Authentication**: Email/password login and signup with JWT tokens
- **Resume Builder**: Comprehensive form with personal details, education, experience, skills, and projects
- **Resume Themes**: Multiple ATS-friendly themes with live preview and selection
- **Version Tracking**: Save and manage multiple versions of your resume
- **PDF Export**: Download resumes as professional PDF documents
- **Email Sharing**: Send a public resume link with a custom message via email
- **AI Suggestions (Gemini)**: Grammar fixes and ATS keyword suggestions for summary and projects
- **Dark/Light Theme**: One-click toggle with persistent preference
- **Activate/Deactivate**: Toggle resume visibility status
- **Dashboard**: Centralized management for create, track, update, duplicate, and delete

### Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with Material-UI and framer-motion animations
- **Client + Server Validation**: Inline field errors and backend validation with structured messages
- **Data Persistence**: Secure storage with MongoDB/Mongoose
- **RESTful API**: Well-structured backend API with `express-validator`, `helmet`, and rate limiting
- **Email Service**: `nodemailer` transport for sharing resumes
- **AI Service**: Gemini via `@google/generative-ai` on a secured backend route

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Professional component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React-to-PDF** - PDF generation
- **framer-motion** - Micro-interactions and animations
- **Formik & Yup** - Form handling and validation

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Nodemailer** - Email sending
- **@google/generative-ai** - Gemini SDK for AI suggestions

### Development Tools

- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd resume-builder
```

### 2. Install Dependencies

#### Backend Setup

```bash
cd backend
npm install
```

#### Frontend Setup

```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
# Optional
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

- Install MongoDB locally or use MongoDB Atlas
- Update the `MONGODB_URI` in your backend `.env` file

### 5. Run the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### 1. Authentication

- Sign up with your email and password
- Log in to access your dashboard

### 2. Create Resume

- Click "Create Resume" on the dashboard
- Fill in personal details, education, experience, skills, and projects
- Choose a theme and save; create versions as you iterate
- Use AI suggestions on Summary and Project descriptions for grammar and ATS keywords

### 3. Manage Resumes

- View all resumes on the dashboard (cards with status and version)
- Edit, duplicate, activate/deactivate, or delete
- Download as PDF from the preview page
- Share via email with a public link and a custom message

### 4. Version Control

- Each save creates a new version
- View version history
- Restore previous versions

## 🎨 Screenshots

### Login Page

![Login Page](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Resume Builder

![Resume Builder](screenshots/resume-builder.png)

### PDF Preview

![PDF Preview](screenshots/pdf-preview.png)

## 🚀 Deployment

### Frontend Deployment (Netlify)

1. **Build the Application**

```bash
cd frontend
npm run build
```

2. **Deploy to Netlify**

- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `build`
- Add environment variables:
  - `REACT_APP_API_URL`: Your backend API URL

### Backend Deployment (Render)

1. **Prepare for Deployment**

- Ensure all dependencies are in `package.json`
- Set up environment variables in Render dashboard

2. **Deploy to Render**

- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables:
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: Your JWT secret key

## 📁 Project Structure

```
resume-builder/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main App component
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
├── screenshots/            # Application screenshots
└── README.md              # Project documentation
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Resumes

- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/versions` - Get resume versions
- `POST /api/resumes/:id/duplicate` - Duplicate resume
- `PUT /api/resumes/:id/toggle` - Activate/Deactivate resume

### Email

- `POST /api/email/share-resume` - Send resume link to recipient with message

### AI Suggestions

- `POST /api/ai/suggest` - Get grammar and ATS keyword suggestions (server-side Gemini)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/resume-builder/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🎯 Roadmap

- [x] Template selection
- [ ] Social media integration
- [x] Resume sharing (email)
- [ ] Advanced formatting options
- [ ] Multi-language support
- [ ] Resume analytics
- [x] AI-powered suggestions (Gemini)

---

**Built with ❤️ using React, Node.js, and MongoDB**
