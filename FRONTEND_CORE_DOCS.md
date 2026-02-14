# Frontend Core Documentation

## Table of Contents
1. [Services Folder](#services-folder)
2. [App.js - Routing](#appjs---routing)
3. [Index.js - Entry Point](#indexjs---entry-point)
4. [Components Folder](#components-folder)

---

## Services Folder

**Location:** `frontend/src/services/api.js`

The services folder contains API client configuration and service functions. It's the **communication layer** between your React frontend and Node.js backend.

### Axios Configuration

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });
```

- **Base URL:** Points to backend API (`http://localhost:5000/api` by default, or from `.env`)
- **Interceptor:** Automatically adds authentication token to all requests from `localStorage`

---

### Service Breakdown

#### 1. **authService** - User Authentication
Handles login, registration, and profile management.

| Function | HTTP Method | Route | Purpose |
|----------|------------|-------|---------|
| `register(data)` | POST | `/auth/register` | Create new user account |
| `login(email, password)` | POST | `/auth/login` | Authenticate user, receive token |
| `getMe()` | GET | `/auth/me` | Get current logged-in user details |
| `updateProfile(data)` | PUT | `/auth/profile` | Update user/company profile info |

**Used in Pages:**
- [Login.js](../pages/Login.js) - `login()` to authenticate
- [Register.js](../pages/Register.js) - `register()` to create account
- [Profile.js](../pages/Profile.js) - `updateProfile()` to save changes

**Example:**
```javascript
const response = await authService.login('user@email.com', 'password123');
// Returns: { token: 'jwt_token', user: {...user data...} }
```

---

#### 2. **jobService** - Job Posting Management
Handles job listing, creation, and retrieval.

| Function | HTTP Method | Route | Purpose |
|----------|------------|-------|---------|
| `getJobs(params)` | GET | `/jobs` | List all jobs with filters (search, location, jobType) |
| `getJob(id)` | GET | `/jobs/:id` | Get single job details by ID |
| `createJob(data)` | POST | `/jobs` | Create new job posting (employer only) |
| `updateJob(id, data)` | PUT | `/jobs/:id` | Update existing job (employer only) |
| `deleteJob(id)` | DELETE | `/jobs/:id` | Delete job posting (employer only) |
| `getMyJobs()` | GET | `/jobs/my-jobs/employer` | Get all jobs posted by current employer |

**Used in Pages:**
- [JobListing.js](../pages/JobListing.js) - `getJobs()` for browsing jobs
- [JobDetail.js](../pages/JobDetail.js) - `getJob()` for job details
- [EmployerDashboard.js](../pages/EmployerDashboard.js) - `createJob()`, `deleteJob()`, `getMyJobs()`

**Example:**
```javascript
// Search jobs by title and location
const response = await jobService.getJobs({ search: 'React', location: 'NYC' });
// Returns: { jobs: [...array of matching jobs...] }
```

---

#### 3. **applicationService** - Job Applications
Handles job application submission, tracking, and status updates.

| Function | HTTP Method | Route | Purpose |
|----------|------------|-------|---------|
| `submitApplication(data)` | POST | `/applications` | Submit job application with cover letter |
| `getUserApplications()` | GET | `/applications` | Get all applications by current job seeker |
| `getJobApplications(jobId)` | GET | `/applications/job/:jobId` | Get all applicants for specific job |
| `updateApplicationStatus(id, status)` | PUT | `/applications/:id` | Change application status (e.g., Reviewed → Interview) |
| `rateApplicant(id, rating, comment)` | PUT | `/applications/:id/rate` | Employer rates applicant (1-5 stars) |
| `withdrawApplication(id)` | DELETE | `/applications/:id` | Job seeker withdraws application |

**Used in Pages:**
- [JobDetail.js](../pages/JobDetail.js) - `submitApplication()` to apply
- [MyApplications.js](../pages/MyApplications.js) - `getUserApplications()`, `withdrawApplication()`
- [EmployerJobApplications.js](../pages/EmployerJobApplications.js) - `getJobApplications()`, `rateApplicant()`

**Example:**
```javascript
// Submit job application
await applicationService.submitApplication({
  jobId: '12345',
  coverLetter: 'I am interested in this role...'
});

// Rate an applicant (1-5 stars)
await applicationService.rateApplicant(appId, 5, 'Excellent candidate!');
```

---

#### 4. **userService** - User Profile & Company Following
Handles user profile retrieval and company follow/unfollow functionality.

| Function | HTTP Method | Route | Purpose |
|----------|------------|-------|---------|
| `getUserById(id)` | GET | `/users/:id` | Get public profile of user/candidate |
| `followCompany(id)` | POST | `/users/:id/follow` | Job seeker follows company for job alerts |
| `unfollowCompany(id)` | POST | `/users/:id/unfollow` | Job seeker unfollows company |

**Used in Pages:**
- [CandidateProfile.js](../pages/CandidateProfile.js) - `getUserById()` to display candidate profile
- [JobDetail.js](../pages/JobDetail.js) - `followCompany()`, `unfollowCompany()`

**Example:**
```javascript
// View candidate's public profile
const response = await userService.getUserById('user123');
// Returns: { user: {name, email, resume, linkedinUrl, portfolioUrl, ...} }

// Follow company for alerts
await userService.followCompany('company456');
```

---

#### 5. **notificationService** - Real-time Notifications
Handles notification retrieval, marking as read, and deletion.

| Function | HTTP Method | Route | Purpose |
|----------|------------|-------|---------|
| `getNotifications()` | GET | `/notifications` | Get all notifications for user |
| `markAsRead(id)` | PUT | `/notifications/:id/read` | Mark single notification as read |
| `markAllAsRead()` | PUT | `/notifications/read-all` | Mark all notifications as read |
| `deleteNotification(id)` | DELETE | `/notifications/:id` | Delete notification |

**Used in Components:**
- [Header.js](../components/Header.js) - Auto-loads every 30 seconds, displays unread count badge

**Example:**
```javascript
// Get notifications and unread count
const response = await notificationService.getNotifications();
// Returns: { notifications: [...], unreadCount: 3 }

// Mark single notification as read
await notificationService.markAsRead(notifId);
```

---

## App.js - Routing

**Location:** `frontend/src/App.js`

This is the **main application file** that sets up routing, global context, and page layout.

### Structure

```
AuthProvider (Global Auth Context)
  ↓
Router (React Router)
  ├── Header (Navigation Bar - all pages)
  ├── Routes (Page Navigation)
  │   ├── / → Home.js
  │   ├── /login → Login.js
  │   ├── /register → Register.js
  │   ├── /jobs → JobListing.js
  │   ├── /job/:id → JobDetail.js
  │   ├── /applications → MyApplications.js (job seeker only)
  │   ├── /employer-dashboard → EmployerDashboard.js (employer only)
  │   ├── /employer-dashboard/jobs/:jobId/applications → EmployerJobApplications.js
  │   ├── /candidate/:id → CandidateProfile.js
  │   └── /profile → Profile.js (authenticated users)
  ├── Footer (Copyright info)
```

### Key Components Explained

**AuthProvider** - Wraps entire app
- Provides global authentication state (user, token, login, logout)
- Data persists via `localStorage`
- See [AuthContext.js](../context/AuthContext.js)

**Router** - Enables client-side routing
- Uses React Router v6
- No page reloads; navigation is instant

**Header** - Visible on every page
- Shows links based on auth status and user role
- Displays notifications
- Logout button
- See [Header.js](../components/Header.js)

**Routes** - Maps URL paths to page components
- `/:id` parameters (e.g., `/job/:id`) extract URL variables
- Pages get these via `useParams()` hook

### Route Categories

**Public Routes** (No auth required)
- `/` - Home landing page
- `/login` - Login form
- `/register` - Registration form
- `/jobs` - Browse all jobs
- `/job/:id` - Job details
- `/candidate/:id` - Public candidate profile

**Protected Routes** (Auth required)
- `/profile` - Edit your profile
- `/applications` - Job seeker's applications
- `/employer-dashboard` - Employer's jobs (employer only)
- `/employer-dashboard/jobs/:jobId/applications` - View applicants (employer only)

---

## Index.js - Entry Point

**Location:** `frontend/src/index.js`

The **first JavaScript file** that runs when your React app loads.

### What It Does

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Step-by-Step:**

1. **Imports:**
   - React & ReactDOM libraries
   - The `App` component (main app)

2. **Create Root:**
   - Finds HTML element with `id="root"` in [public/index.html](../public/index.html)
   - Creates React root there

3. **Render App:**
   - Renders `<App />` component into the root
   - `<React.StrictMode>` detects deprecated code patterns during development

**In Summary:** Index.js is the glue that connects your JavaScript to the HTML file.

---

## Components Folder

**Location:** `frontend/src/components/`

Currently contains one shared component used across all pages.

### Header.js

**Purpose:** Navigation bar displayed at top of every page

**Features:**
- **Logo:** Links back to home (`/`)
- **Conditional Navigation:** Shows different menu items based on authentication status and user role
- **Notifications Bell:** 
  - Loads notifications every 30 seconds
  - Shows unread count badge
  - Click to view recent notifications
  - Mark as read functionality
- **Logout Button:** Clears auth state and redirects to home

**User Role Detection:**
```javascript
if (user?.userType === 'job_seeker') {
  // Show: Browse Jobs, My Applications, Profile, Logout
}
if (user?.userType === 'employer') {
  // Show: Browse Jobs, Dashboard, Profile, Logout
}
if (!isAuthenticated) {
  // Show: Browse Jobs, Login, Register
}
```

**Key Functions:**
- `loadNotifications()` - Fetch notifications from backend
- `handleLogout()` - Clear auth and redirect
- `markAsRead(id)` - Mark individual notification as read

**Styling:** [styles/Header.css](../styles/Header.css)

---

## Service Architecture Diagram

```
Frontend Component
       ↓
  (User Action)
       ↓
  Service Function
  (e.g., jobService.getJobs())
       ↓
  Axios HTTP Request
  (with token interceptor)
       ↓
┌─────────────────────┐
│  Backend API        │
│ (Express Server)    │
│ http://localhost... │
└─────────────────────┘
       ↓
  Response Data
  (JSON)
       ↓
  Component State
  (setState, hooks)
       ↓
  Re-render UI
```

---

## Quick Reference - Where to Find Things

| What | Where |
|------|-------|
| Authentication logic | [services/api.js](../services/api.js) - `authService` |
| Job search/listing | [services/api.js](../services/api.js) - `jobService` |
| Application handling | [services/api.js](../services/api.js) - `applicationService` |
| User profiles | [services/api.js](../services/api.js) - `userService` |
| Notifications | [services/api.js](../services/api.js) - `notificationService` |
| All routes | [App.js](../App.js) |
| Navigation | [components/Header.js](../components/Header.js) |
| Global auth state | [context/AuthContext.js](../context/AuthContext.js) |
| App entry | [index.js](../index.js) |

---

## Environment Variables

File: `frontend/.env`

```
REACT_APP_API_URL=http://10.88.113.159:5000/api
```

- Controls backend API base URL
- Loaded via `process.env.REACT_APP_API_URL`
- Used in [services/api.js](../services/api.js)

**For local development:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**For mobile on same network:**
```
REACT_APP_API_URL=http://192.168.x.x:5000/api
```

