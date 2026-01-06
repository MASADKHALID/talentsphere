import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerJobApplications from './pages/EmployerJobApplications';
import CandidateProfile from './pages/CandidateProfile';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobListing />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/employer-dashboard/jobs/:jobId/applications" element={<EmployerJobApplications />} />
            <Route path="/candidate/:id" element={<CandidateProfile />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 TalentSphere. All rights reserved.</p>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
