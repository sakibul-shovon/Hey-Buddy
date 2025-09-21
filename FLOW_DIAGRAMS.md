# Hey Buddy - Application Flow Diagrams

## User Authentication Flow
```
Landing Page (/)
      ↓
Sign Up (/signup) ← → Login (/login)
      ↓                    ↓
Form Validation      Credential Check
      ↓                    ↓
Password Hashing     JWT Generation
      ↓                    ↓
MongoDB Storage      Token Storage
      ↓                    ↓
Success Message      Dashboard Redirect
```

## Application Navigation Flow
```
Dashboard (/dashboard)
    ├── Find Buddy (/find_buddy)
    │   ├── Browse Users
    │   ├── View Profiles
    │   └── Add Friends
    │
    ├── Micro Projects (/micro_project)
    │   ├── Browse Tab
    │   │   ├── View All Projects
    │   │   └── Place Bids
    │   ├── My Projects Tab
    │   │   ├── Posted Projects
    │   │   └── Manage Bids
    │   └── My Bids Tab
    │       └── Track Bid Status
    │
    ├── Showcase Projects (/show_case)
    │   ├── Submit Projects
    │   └── Browse Gallery
    │
    ├── Real-time Chat (/chat)
    │   ├── User List
    │   ├── Private Messages
    │   └── Message History
    │
    └── Edit Profile (/edit-profile)
        ├── Basic Info
        ├── Skills & Interests
        ├── Profile Picture
        └── Social Links
```

## Backend API Architecture
```
Main Server (app.js:8000)
├── Authentication Routes
│   ├── POST /signup
│   └── POST /login
│
├── User Management
│   ├── GET /api/users
│   ├── GET /api/profile
│   ├── PUT /api/profile
│   └── POST /api/user/add-friend
│
├── Profile Pictures
│   ├── POST /api/upload-profile-picture
│   ├── DELETE /api/delete-profile-picture
│   └── GET /api/cloudinary-signature
│
├── Projects (via routes)
│   ├── POST /api/projects
│   └── GET /api/projects
│
└── Micro Projects (via routes)
    ├── POST /api/microprojects
    ├── GET /api/microprojects
    ├── GET /api/my-microprojects/:userId
    └── POST /api/microprojects/:id/bid

Chat Server (server.js:5000)
├── Socket.io Events
│   ├── join
│   ├── sendPrivateMessage
│   ├── messageSeen
│   └── disconnect
│
└── Message API
    └── GET /api/messages
```

## Data Flow Architecture
```
Frontend (React)
      ↓ HTTP Requests
Backend API (Express)
      ↓ Database Operations
MongoDB (Mongoose)
      ↓ Real-time Events
Socket.io Server
      ↓ Live Updates
Frontend (React)

External Services:
├── Cloudinary (Image Storage)
└── JWT (Authentication)
```

## Component Hierarchy
```
App.jsx
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── Layout (for public pages)
│           │   ├── Header
│           │   ├── Footer
│           │   └── Page Content
│           │
│           └── ProtectedRoute (for authenticated pages)
│               ├── Dashboard
│               │   ├── Stats
│               │   ├── Heatmap
│               │   └── FriendListModal
│               │
│               ├── FindBuddy
│               ├── MicroProjectsPage
│               ├── ShowcaseProjectsPage
│               ├── Chat
│               └── EditProfile
```

## State Management Flow
```
AuthContext
├── isAuthenticated (boolean)
├── username (string)
├── email (string)
├── login() function
└── logout() function
    ↓ provides to
All Protected Components

ThemeContext
├── theme (light/dark)
└── toggleTheme() function
    ↓ provides to
All UI Components
```

## Security Flow
```
User Request
    ↓
CORS Validation
    ↓
JWT Token Check (for protected routes)
    ↓ (if valid)
Route Handler Execution
    ↓
Database Operation
    ↓
Response with Data

Password Security:
User Input → Bcrypt Hashing → Database Storage
Database → Bcrypt Compare → Authentication Result
```