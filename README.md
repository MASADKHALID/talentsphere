# TalentSphere - MERN Hiring Platform

A full-stack job marketplace application similar to Indeed and Glassdoor, built with MERN stack (MongoDB, Express, React, Node.js).

## Features

✅ **User Authentication**
- User registration and login with JWT
- Support for both job seekers and employers
- Secure password hashing with bcryptjs

✅ **Job Listings & Search**
- Browse job listings with advanced filtering
- Search by job title, company, location
- Filter by job type and experience level
- View detailed job information

✅ **Job Applications**
- Job seekers can apply to jobs
- Submit cover letters with applications
- Track application status (Applied, Reviewed, Interview, Accepted, Rejected)
- Withdraw applications
- Prevent duplicate applications

✅ **Employer Dashboard**
- Post new job listings
- View applications for posted jobs
- Update application status
- Manage job postings

✅ **User Profiles**
- Job seekers: Upload resume, profile photo
- Employers: Company information and description
- Edit profile information

## Project Structure

```
hiring-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Header.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── JobListing.js
    │   │   ├── JobDetail.js
    │   │   ├── MyApplications.js
    │   │   ├── EmployerDashboard.js
    │   │   └── Profile.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── Header.css
    │   │   ├── Auth.css
    │   │   ├── JobListing.css
    │   │   ├── JobDetail.css
    │   │   ├── Applications.css
    │   │   ├── EmployerDashboard.css
    │   │   └── Profile.css
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── package.json
    └── .gitignore
```

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/hiring-app
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Jobs
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/my-jobs/employer` - Get employer's jobs (protected)

### Applications
- `POST /api/applications` - Submit application (job seeker)
- `GET /api/applications` - Get user's applications (protected)
- `GET /api/applications/job/:jobId` - Get job applications (employer)
- `PUT /api/applications/:id` - Update application status (employer)
- `DELETE /api/applications/:id` - Withdraw application (protected)

## Usage

### For Job Seekers
1. Register as a job seeker
2. Browse job listings using search and filters
3. Click on jobs to view details
4. Apply to jobs with a cover letter
5. Track application status in "My Applications"
6. Update your profile with resume and photo

### For Employers
1. Register as an employer
2. Go to "Dashboard" to post new jobs
3. Fill in job details, requirements, and responsibilities
4. View applications for your posted jobs
5. Update application status through the dashboard
6. Update company information in profile

## Future Enhancements

- File upload for resumes and profile photos
- Email notifications for applications
- Saved jobs/wishlist for job seekers
- Company reviews and ratings
- Interview scheduling
- Chat/messaging between employers and candidates
- Advanced analytics for employers
- Payment integration for featured listings
- Dark mode

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
