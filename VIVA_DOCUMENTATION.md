# TalentSphere - MERN Hiring Platform
## Viva & Documentation Guide

---

## PROJECT OVERVIEW

**TalentSphere** is a full-stack **job marketplace application** similar to Indeed and Glassdoor. It's built using the **MERN Stack** (MongoDB, Express, React, Node.js).

**Purpose:** Connect job seekers with employers, allowing them to browse jobs, apply, and manage applications effectively.

---

## 📁 FOLDER STRUCTURE & WHAT EACH DOES

### **BACKEND FOLDER** (`c:\Users\umark\Desktop\New folder\hiring-app\backend\`)

The backend is a **REST API** built with Node.js and Express that handles all business logic and data management.

#### **What Backend Does:**
- Receives requests from the frontend (React)
- Processes user authentication (login/register)
- Manages database operations (Create, Read, Update, Delete - CRUD)
- Handles job postings, applications, and user profiles
- Sends responses back to the frontend

#### **Backend File Structure:**

1. **`server.js`** - Main entry point
   - Initializes Express server
   - Connects middleware (CORS, JSON parsing)
   - Connects to MongoDB database
   - Registers all API routes
   - Runs on port 5000

2. **`config/db.js`** - Database configuration
   - Connects to MongoDB using Mongoose
   - Sets up database connection parameters

3. **`models/`** - Data schemas (defines what data looks like)
   - `User.js` - Stores user info (jobseekers & employers)
   - `Job.js` - Stores job listings
   - `Application.js` - Stores job applications
   - `Notification.js` - Stores notifications
   
4. **`controllers/`** - Business logic (processes requests)
   - `authController.js` - Handles login/register logic
   - `jobController.js` - Handles job posting/search logic
   - `applicationController.js` - Handles job applications
   - `userController.js` - Handles user profiles
   - `notificationController.js` - Handles notifications

5. **`routes/`** - API endpoints (URLs)
   - `authRoutes.js` - Routes for login/register
   - `jobRoutes.js` - Routes for browsing/posting jobs
   - `applicationRoutes.js` - Routes for applying to jobs
   - `userRoutes.js` - Routes for user profiles
   - `notificationRoutes.js` - Routes for notifications

6. **`middleware/auth.js`** - Security layer
   - Verifies JWT tokens
   - Protects routes that need authentication

#### **Backend Tech Stack:**
- **Framework:** Express.js (lightweight web framework)
- **Database:** MongoDB with Mongoose (stores all data)
- **Authentication:** JWT (JSON Web Tokens) - secure login system
- **Password Security:** bcryptjs (encrypts passwords)
- **Validation:** express-validator (checks data correctness)

#### **Backend API Endpoints:**
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/jobs               - Get all job listings
POST   /api/jobs               - Create new job (employers)
GET    /api/jobs/:id           - Get job details
POST   /api/applications       - Apply for a job
GET    /api/applications       - Get user's applications
PUT    /api/applications/:id   - Update application status
GET    /api/users/profile      - Get user profile
PUT    /api/users/profile      - Update user profile
```

---

### **FRONTEND FOLDER** (`c:\Users\umark\Desktop\New folder\hiring-app\frontend\`)

The frontend is a **React web application** that displays the UI and interacts with the backend API.

#### **What Frontend Does:**
- Displays user interface (what users see in browser)
- Collects user input (forms, searches)
- Sends requests to backend API
- Displays data from backend
- Handles user authentication on the client side
- Manages theme and user state

#### **Frontend File Structure:**

1. **`public/index.html`** - HTML entry point
   - Main HTML file loaded by browser
   - Contains root div where React app is rendered

2. **`src/App.js`** - Main component
   - Sets up routing (which page to show based on URL)
   - Provides authentication context to entire app
   - Shows Header, Routes, and Footer

3. **`src/index.js`** - React entry point
   - Renders App.js into the DOM

4. **`components/`** - Reusable UI components
   - `Header.js` - Navigation bar (visible on all pages)

5. **`pages/`** - Full page components
   - `Home.js` - Landing page
   - `Register.js` - User registration page
   - `Login.js` - User login page
   - `JobListing.js` - Browse all jobs with filters
   - `JobDetail.js` - View single job details
   - `MyApplications.js` - View your job applications
   - `EmployerDashboard.js` - Employer's main dashboard
   - `EmployerJobApplications.js` - View applications for a job
   - `CandidateProfile.js` - View candidate's profile
   - `Profile.js` - Edit your own profile

6. **`context/`** - Global state management
   - `AuthContext.js` - Manages user login state across entire app
   - `ThemeContext.js` - Manages light/dark theme

7. **`services/`** - API communication
   - `api.js` - Axios instance that communicates with backend
   - Contains all HTTP requests (GET, POST, PUT, DELETE)

8. **`styles/`** - CSS styling
   - `App.css` - Main styles
   - `Header.css` - Navigation styling
   - `Auth.css` - Login/Register page styles
   - `JobListing.css` - Job listings styling
   - `JobDetail.css` - Job details styling
   - `EmployerDashboard.css` - Employer dashboard styling
   - `Applications.css` - Applications page styling
   - `Profile.css` - Profile page styling
   - `theme.css` - Theme-related styles

#### **Frontend Tech Stack:**
- **Framework:** React (UI library)
- **Routing:** React Router (navigate between pages)
- **HTTP Requests:** Axios (communicate with backend)
- **Styling:** CSS (design and layout)
- **State Management:** Context API (share data across components)

#### **Frontend User Flows:**

**For Job Seekers:**
1. Register/Login → View Jobs → Apply for Job → Track Applications → Edit Profile

**For Employers:**
1. Register/Login as Employer → Post Job → View Applications → Update Status → Manage Profile

---

## 🔄 HOW FRONTEND & BACKEND WORK TOGETHER

```
User Browser (Frontend)
        ↓
   React App
        ↓
   Sends HTTP Request (API call)
        ↓
   Backend Server (Node.js/Express)
        ↓
   Process Request (Controllers)
        ↓
   Query Database (MongoDB)
        ↓
   Send Response (JSON data)
        ↓
   React receives data
        ↓
   Display to user
```

---

## 🔐 KEY FEATURES EXPLAINED

### **1. User Authentication**
- User enters email/password
- Backend hashes password using bcryptjs
- Stores in MongoDB
- On login, generates JWT token
- Frontend stores token, uses for protected routes
- Backend verifies token on every request

### **2. Job Posting (Employers)**
- Employer fills job form
- Frontend sends to backend
- Backend stores in Job collection
- All job seekers can now see it

### **3. Job Application (Job Seekers)**
- Seeker clicks "Apply" on job
- Sends application to backend
- Backend creates Application document
- Links user to job
- Prevents duplicate applications

### **4. Application Status Tracking**
- Employer views applications on dashboard
- Can change status: Applied → Reviewed → Interview → Accepted/Rejected
- Seeker can see status in real-time

### **5. User Profiles**
- Seekers: Upload resume, photo, skills
- Employers: Company info, description
- Both: Edit profile information
- Data stored and retrieved from MongoDB

---

## 📊 DATABASE SCHEMA (What data looks like)

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: 'jobseeker' or 'employer',
  resume: String (file path),
  profilePhoto: String (file path),
  skills: [String],
  experience: String,
  companyName: String (if employer),
  companyDescription: String,
  createdAt: Date
}
```

### **Job Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  company: String,
  location: String,
  salary: String,
  jobType: 'Full-time' or 'Part-time' or 'Contract',
  experienceLevel: 'Beginner' or 'Intermediate' or 'Expert',
  postedBy: ObjectId (references User),
  applicants: [ObjectId] (references Users),
  createdAt: Date
}
```

### **Application Collection**
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (references Job),
  userId: ObjectId (references User),
  coverLetter: String,
  status: 'Applied' or 'Reviewed' or 'Interview' or 'Accepted' or 'Rejected',
  appliedAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ DEPENDENCIES & LIBRARIES

### **Backend Dependencies:**
| Package | Purpose |
|---------|---------|
| express | Web framework for building APIs |
| mongoose | MongoDB object modeling |
| bcryptjs | Password hashing (security) |
| jsonwebtoken (JWT) | User authentication tokens |
| cors | Allow requests from frontend |
| dotenv | Environment variables (.env) |
| express-validator | Input validation |
| nodemon | Auto-restart during development |

### **Frontend Dependencies:**
| Package | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Page routing/navigation |
| axios | HTTP requests to backend |
| react-dom | Render React to HTML |

---

## 🚀 HOW TO RUN THE PROJECT

### **Backend Setup:**
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### **Frontend Setup:**
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 📋 COMMON VIVA QUESTIONS & ANSWERS

### **Q1: What is this project about?**
**A:** TalentSphere is a MERN stack job marketplace similar to Indeed. It allows job seekers to browse and apply for jobs, and enables employers to post jobs and manage applications.

### **Q2: What does the backend do?**
**A:** The backend is a REST API built with Node.js and Express. It handles:
- User authentication (login/register)
- Database operations (storing jobs, applications, users)
- Business logic (processing applications, updating status)
- API endpoints that the frontend calls

### **Q3: What does the frontend do?**
**A:** The frontend is a React web application that:
- Displays the user interface
- Sends requests to the backend API
- Manages user state and authentication
- Handles client-side routing between pages

### **Q4: How does authentication work?**
**A:** When user registers, backend hashes password with bcryptjs and stores it. On login, backend generates a JWT token. Frontend stores this token and includes it in all requests. Backend verifies token to protect routes.

### **Q5: What database do you use and why?**
**A:** MongoDB with Mongoose. It's a NoSQL database good for:
- Flexible schema (documents can have different fields)
- Easy to integrate with Node.js
- Good for prototyping and MVP development

### **Q6: How do job applications work?**
**A:** 
1. Seeker clicks apply on a job
2. Frontend sends application data to backend
3. Backend creates Application document linking user to job
4. Prevents duplicate applications
5. Employer can view and update status
6. Seeker sees status in real-time

### **Q7: What are the main features?**
**A:**
- User registration & authentication (2 types: seeker & employer)
- Job listings with search & filters
- Job applications with status tracking
- User profiles with resume/skills
- Employer dashboard for managing jobs
- Notifications for applications

### **Q8: What technologies are used?**
**A:**
- **Frontend:** React, React Router, Axios, CSS
- **Backend:** Node.js, Express.js, MongoDB/Mongoose
- **Authentication:** JWT, bcryptjs
- **Other:** CORS, dotenv, express-validator

### **Q9: How is the frontend structured?**
**A:** Using component-based architecture:
- **Pages:** Full-page components (JobListing, Login, etc.)
- **Components:** Reusable UI pieces (Header)
- **Context:** Global state (AuthContext for user login)
- **Services:** API communication (api.js with axios)
- **Styles:** CSS files for each component

### **Q10: What are API endpoints?**
**A:** Main endpoints:
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Post new job
- `POST /api/applications` - Apply for job
- `PUT /api/applications/:id` - Update application status
- `GET /api/users/profile` - Get profile

---

## 💡 TIPS FOR VIVA

1. **Understand the flow:** Know how data flows from UI → Frontend → Backend → Database → Back to Frontend
2. **Be clear about roles:** Backend = API & Database logic, Frontend = UI & User interaction
3. **Know your tech stack:** Be ready to explain why you chose each technology
4. **Practice explaining features:** Be able to walk through how job application works step-by-step
5. **Understand security:** Explain JWT, password hashing, and token validation
6. **Know the models:** Understand User, Job, and Application schemas
7. **Be ready to code:** Practice making API calls, database queries, and React components

---

