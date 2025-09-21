# Hey Buddy - Project Workflow Documentation

## Overview

Hey Buddy is a full-stack web application designed to connect developers and designers in a collaborative platform. It facilitates networking, project collaboration, and skill development through various features including real-time chat, project showcases, micro-projects, and buddy finding.

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with Vite, React Router, Tailwind CSS
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary for profile pictures
- **Security**: Bcrypt for password hashing

### Project Structure
```
Hey-Buddy/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages/routes
│   ├── context/           # React context providers
│   └── utils/             # Utility functions
├── Backend/               # Node.js backend server
│   ├── models/           # MongoDB data models
│   ├── routes/           # API route handlers
│   ├── app.js            # Main application server
│   └── server.js         # Socket.io chat server
└── public/               # Static assets
```

## Application Workflow

### 1. User Authentication Flow

#### Registration Process
1. **User Access**: User visits the landing page (`/`)
2. **Sign Up**: User clicks on Sign Up and navigates to `/signup`
3. **Form Submission**: User fills out registration form with email and password
4. **Backend Processing**: 
   - Email uniqueness validation
   - Password hashing using bcrypt
   - User document creation in MongoDB
5. **Response**: Success message or error handling

#### Login Process
1. **Login Page**: User navigates to `/login`
2. **Credential Submission**: User enters email and password
3. **Authentication**: 
   - Backend validates credentials
   - Password comparison using bcrypt
   - JWT token generation if valid
4. **Token Storage**: JWT stored in localStorage
5. **Redirect**: User redirected to dashboard on successful login

#### Protected Routes
- `ProtectedRoute` component checks authentication status
- Redirects unauthenticated users to login page
- Uses `AuthContext` for state management

### 2. Dashboard and Profile Management

#### Dashboard Features
1. **Profile Picture Management**:
   - Upload to Cloudinary
   - Database reference storage
   - Image deletion functionality

2. **Activity Heatmap**:
   - Tracks user login dates
   - Visual representation using react-calendar-heatmap
   - Updates on each login session

3. **Profile Editing**:
   - Name, title, experience fields
   - Skills and interests arrays
   - GitHub URL and portfolio links
   - Bio information

4. **Friend Management**:
   - Add/remove friends functionality
   - Bidirectional friendship relationships
   - Friend list modal display

### 3. Core Application Features

#### Find Buddy Feature (`/find_buddy`)
1. **User Discovery**: Browse all registered users
2. **Profile Viewing**: See detailed profiles with skills and interests
3. **Connection**: Add users as friends
4. **Filtering**: Search and filter by skills or interests

#### Micro Projects Feature (`/micro_project`)
1. **Project Posting**:
   - Title, description, category
   - Required skills specification
   - Budget range setting
   - Project ownership tracking

2. **Project Browsing**:
   - View all available projects
   - Filter by category or skills
   - See project details and requirements

3. **Bidding System**:
   - Users can bid on projects
   - Bid amount and bidder tracking
   - Project owner can review bids

4. **Project Management**:
   - "My Projects" tab for posted projects
   - "My Bids" tab for bid tracking
   - Project status management

#### Showcase Projects Feature (`/show_case`)
1. **Project Submission**:
   - Project title and description
   - Live demo link
   - Category classification
   - Public showcase

2. **Community Gallery**:
   - Browse all showcased projects
   - Category-based filtering
   - Project interaction and feedback

#### Real-time Chat Feature (`/chat`)
1. **Socket.io Integration**:
   - Real-time message delivery
   - Online user presence
   - Connection status tracking

2. **Private Messaging**:
   - One-on-one conversations
   - Message history persistence
   - Read receipt functionality

3. **User Interface**:
   - User list sidebar
   - Message thread display
   - Send message functionality

### 4. Backend API Architecture

#### Main Server (app.js - Port 8000)
**Authentication Endpoints**:
- `POST /signup` - User registration
- `POST /login` - User authentication
- Middleware: JWT token verification

**User Management**:
- `GET /api/users` - Fetch all users
- `POST /api/user/add-friend` - Add friend relationship
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

**Profile Picture Management**:
- `POST /api/upload-profile-picture` - Upload image
- `DELETE /api/delete-profile-picture` - Remove image
- `GET /api/cloudinary-signature` - Generate upload signature

**Project Routes** (via projectRoutes.js):
- `POST /api/projects` - Submit showcase project
- `GET /api/projects` - Fetch all projects

**Micro-project Routes** (via microprojectsRoutes.js):
- `POST /api/microprojects` - Create micro-project
- `GET /api/microprojects` - List all micro-projects
- `GET /api/my-microprojects/:userId` - User's projects
- `POST /api/microprojects/:id/bid` - Place bid

#### Chat Server (server.js - Port 5000)
**Socket.io Events**:
- `join` - User connects to chat
- `sendPrivateMessage` - Send message to specific user
- `messageSeen` - Mark message as read
- `disconnect` - User leaves chat

**Message Management**:
- `GET /api/messages` - Fetch message history
- Real-time message broadcasting
- Online user list management

### 5. Data Models

#### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  profilePictureId: ObjectId (reference to ProfilePictures),
  name: String,
  title: String,
  experience: String,
  skills: [String],
  interests: [String],
  lookingFor: [String],
  friends: [ObjectId] (references to other users),
  githubUrl: String,
  portfolio: String,
  bio: String,
  loginDates: [Date]
}
```

#### Message Model
```javascript
{
  sender: String (required),
  recipient: String (required),
  text: String (required),
  timestamp: Date (default: now),
  seen: Boolean (default: false)
}
```

#### Project Models
- **Showcase Projects**: title, description, link, category
- **Micro Projects**: title, description, postedBy, bids array

### 6. State Management

#### React Context Providers
1. **AuthContext**:
   - Authentication status
   - User credentials (username, email)
   - Login/logout functions
   - Token management

2. **ThemeContext**:
   - Dark/light mode toggle
   - Theme persistence
   - UI preference management

### 7. Security Measures

1. **Password Security**:
   - Bcrypt hashing with salt rounds
   - No plain text storage

2. **Authentication**:
   - JWT tokens with expiration
   - Token-based route protection
   - Secure token storage

3. **CORS Configuration**:
   - Cross-origin request handling
   - Specific origin allowlisting
   - Credential support

4. **Environment Variables**:
   - Sensitive data externalization
   - Database connection strings
   - API keys and secrets

### 8. User Journey Examples

#### New User Onboarding
1. Land on homepage → Sign up → Email verification → Profile setup → Dashboard access

#### Finding a Collaboration Partner
1. Dashboard → Find Buddy → Browse users → View profile → Add friend → Start chatting

#### Working on a Micro Project
1. Dashboard → Micro Projects → Browse available projects → Place bid → Get selected → Collaborate

#### Showcasing Work
1. Dashboard → Showcase Projects → Submit project → Fill details → Publish → Community viewing

### 9. Development Workflow

#### Frontend Development
1. React component development with hooks
2. Tailwind CSS for styling
3. Axios for API communication
4. React Router for navigation
5. Vite for development server and building

#### Backend Development
1. Express.js route handling
2. Mongoose for MongoDB operations
3. JWT middleware for authentication
4. Socket.io for real-time features
5. Cloudinary integration for file uploads

#### Deployment Considerations
- Environment variable configuration
- Database connection setup
- CORS policy configuration
- Socket.io server coordination
- Static file serving

This workflow documentation provides a comprehensive overview of how the Hey Buddy application operates, from user authentication to real-time collaboration features.