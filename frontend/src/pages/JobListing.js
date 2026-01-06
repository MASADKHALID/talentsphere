import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';
import '../styles/JobListing.css';

function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [search, location, jobType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;

      const response = await jobService.getJobs(params);
      setJobs(response.data.jobs);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-listing-container">
      <div className="search-section">
        <h1>Find Your Next Job</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="search-input"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="jobs-container">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found. Try adjusting your search criteria.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.jobType}</span>
              </div>
              <p className="company">
                {job.company?.companyName || job.company?.name}
              </p>
              <p className="location">📍 {job.location}</p>
              <p className="description">{job.description.substring(0, 150)}...</p>
              <div className="job-footer">
                <div className="salary">
                  {job.salary?.min && job.salary?.max && (
                    <span>${job.salary.min}k - ${job.salary.max}k</span>
                  )}
                </div>
                <Link to={`/job/${job._id}`} className="btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobListing;
