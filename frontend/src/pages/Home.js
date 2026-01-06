import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to TalentSphere</h1>
        <p className="tagline">Your gateway to finding the perfect job or the perfect candidate</p>
      </div>

      <div className="options-container">
        <div className="option-card job-seeker-card">
          <div className="icon">🔍</div>
          <h2>I'm Looking for a Job</h2>
          <p>Browse thousands of job opportunities and apply with ease</p>
          <ul className="features-list">
            <li>✓ Search and filter jobs</li>
            <li>✓ Apply with one click</li>
            <li>✓ Track applications</li>
            <li>✓ Update your profile</li>
          </ul>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>

        <div className="option-card employer-card">
          <div className="icon">💼</div>
          <h2>I'm Hiring Talent</h2>
          <p>Post jobs and find the best candidates for your company</p>
          <ul className="features-list">
            <li>✓ Post unlimited jobs</li>
            <li>✓ Manage applications</li>
            <li>✓ Review candidates</li>
            <li>✓ Company dashboard</li>
          </ul>
          <Link to="/employer-dashboard" className="btn-primary">
            Employer Dashboard
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat">
          <h3>0</h3>
          <p>Active Jobs</p>
        </div>
        <div className="stat">
          <h3>0</h3>
          <p>Job Seekers</p>
        </div>
        <div className="stat">
          <h3>0</h3>
          <p>Companies</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
