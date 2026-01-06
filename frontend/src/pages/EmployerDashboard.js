import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobService } from '../services/api';
import '../styles/EmployerDashboard.css';

function EmployerDashboard() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    requirements: '',
    responsibilities: '',
    salary: { min: '', max: '' },
  });

  useEffect(() => {
    if (user?.userType === 'employer') {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data.jobs);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salary: { ...prev.salary, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter((r) => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter((r) => r.trim()),
      };
      await jobService.createJob(jobData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        requirements: '',
        responsibilities: '',
        salary: { min: '', max: '' },
      });
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
      } catch (err) {
        setError('Failed to delete job');
      }
    }
  };

  return (
    <div className="employer-dashboard">
      <h1>Employer Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {!showForm ? (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Post New Job
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="job-form">
          <h2>Post a New Job</h2>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior React Developer"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed job description"
              rows="6"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, Country"
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobType">Job Type</label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Min Salary (k)</label>
              <input
                type="number"
                id="salaryMin"
                name="min"
                value={formData.salary.min}
                onChange={handleSalaryChange}
                placeholder="50"
              />
            </div>
            <div className="form-group">
              <label htmlFor="salaryMax">Max Salary (k)</label>
              <input
                type="number"
                id="salaryMax"
                name="max"
                value={formData.salary.max}
                onChange={handleSalaryChange}
                placeholder="150"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="requirements">Requirements (one per line)</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="5+ years experience in React&#10;Strong JavaScript skills"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="responsibilities">Responsibilities (one per line)</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Develop React components&#10;Lead code reviews"
              rows="4"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn-primary">
              Post Job
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="jobs-section">
        <h2>Your Posted Jobs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p className="location">📍 {job.location}</p>
                <p className="job-type">{job.jobType}</p>
                <p className="applications">Applications: {job.applicationCount}</p>
                <div className="card-actions">
                  <Link className="btn-secondary" to={`/employer-dashboard/jobs/${job._id}/applications`}>
                    View Applications
                  </Link>
                  <button className="btn-danger" onClick={() => handleDeleteJob(job._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
