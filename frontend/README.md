# Resume Builder Frontend

A modern React-based frontend for the Resume Builder platform, built with Material-UI for a beautiful and responsive user interface.

## Features

- **Modern UI/UX**: Built with Material-UI components for a professional look
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Authentication**: Secure login/register with JWT token management
- **Dashboard**: Overview of all resumes with statistics and quick actions
- **Resume Builder**: Multi-step form for creating and editing resumes
- **Resume Preview**: Read-only view with PDF download capability
- **Profile Management**: Update personal information and change password
- **Real-time Validation**: Client-side form validation with helpful error messages

## Technology Stack

- **React 18**: Latest React with hooks and modern patterns
- **Material-UI (MUI)**: Professional UI component library
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **React-to-PDF**: PDF generation for resume downloads
- **Formik & Yup**: Form handling and validation
- **date-fns**: Date formatting utilities

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   ├── LoadingSpinner.js # Loading indicator
│   └── ConfirmDialog.js # Confirmation dialogs
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Main dashboard
│   ├── ResumeBuilder.js # Resume creation/editing
│   ├── ResumePreview.js # Resume preview
│   └── Profile.js      # User profile management
├── services/           # API services
│   ├── authService.js  # Authentication API calls
│   └── resumeService.js # Resume API calls
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
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
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Building for Production

1. Create a production build:

   ```bash
   npm run build
   ```

2. The build files will be created in the `build/` directory

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Create production build
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App (not recommended)

## Component Documentation

### Core Components

#### Navbar

The main navigation component that displays the brand, navigation links, and user menu.

#### LoadingSpinner

A reusable loading indicator with customizable message and size.

#### ConfirmDialog

A confirmation dialog for delete operations and other confirmations.

### Pages

#### Login

User authentication page with email and password fields.

#### Register

User registration page with name, email, and password fields.

#### Dashboard

Main dashboard showing resume statistics and a grid of user's resumes.

#### ResumeBuilder

Multi-step form for creating and editing resumes with sections for:

- Personal Information
- Education
- Experience
- Skills
- Projects

#### ResumePreview

Read-only preview of a resume with options to edit, print, or download as PDF.

#### Profile

User profile management page for updating personal information and changing password.

## API Integration

The frontend communicates with the backend API through service modules:

- `authService.js`: Handles authentication-related API calls
- `resumeService.js`: Handles resume-related API calls

Both services include:

- Automatic JWT token attachment to requests
- 401 error handling with automatic logout
- Consistent error handling

## State Management

Authentication state is managed globally using React Context (`AuthContext.js`):

- User information
- Authentication status
- Loading states
- Error handling

## Styling

The application uses Material-UI's theming system with:

- Custom color palette
- Typography configuration
- Component style overrides
- Responsive design breakpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

The frontend can be deployed to various platforms:

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Configure environment variables

## Contributing

1. Follow the existing code style and patterns
2. Use Material-UI components for consistency
3. Add proper error handling and loading states
4. Test on different screen sizes for responsiveness
5. Update documentation for new features

## License

This project is licensed under the MIT License.
