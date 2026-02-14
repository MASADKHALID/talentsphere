import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobService, applicationService, userService } from '../services/api';
import '../styles/JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const response = await jobService.getJob(id);
      setJob(response.data.job);
      setError('');
    } catch (err) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to apply for jobs');
      return;
    }

    if (user?.userType !== 'job_seeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.submitApplication({
        jobId: id,
        coverLetter,
      });
      setSuccessMessage('Application submitted successfully!');
      setCoverLetter('');
      setShowApplicationForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFollowCompany = async () => {
    if (!isAuthenticated) {
      alert('Please login to follow companies');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await userService.unfollowCompany(job.company._id);
        setIsFollowing(false);
        setSuccessMessage('Company unfollowed');
      } else {
        await userService.followCompany(job.company._id);
        setIsFollowing(true);
        setSuccessMessage('Company followed!');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) return <div className="error-message">{error}</div>;

  if (!job) return <div className="error-message">Job not found</div>;

  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <div>
          <h1>{job.title}</h1>
          <p className="company">
            {job.company?.companyName || job.company?.name}
          </p>
        </div>
        {isAuthenticated && user?.userType === 'job_seeker' && (
          <button
            className={`btn-follow ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowCompany}
            disabled={followLoading}
            title={isFollowing ? 'Unfollow company' : 'Follow company for job alerts'}
          >
            {followLoading ? '...' : isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        )}
      </div>

      <div className="job-detail-content">
        <div className="job-info">
          <div className="info-item">
            <span className="label">Location</span>
            <span className="value">{job.location}</span>
          </div>
          <div className="info-item">
            <span className="label">Job Type</span>
            <span className="value">{job.jobType}</span>
          </div>
          <div className="info-item">
            <span className="label">Experience Level</span>
            <span className="value">{job.experienceLevel}</span>
          </div>
          {job.salary?.min && job.salary?.max && (
            <div className="info-item">
              <span className="label">Salary</span>
              <span className="value">
                ${job.salary.min}k - ${job.salary.max}k
              </span>
            </div>
          )}
        </div>

        <div className="job-description">
          <h3>Description</h3>
          <p>{job.description}</p>

          {job.responsibilities?.length > 0 && (
            <div>
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {isAuthenticated && user?.userType === 'job_seeker' && (
        <div className="application-section">
          {!showApplicationForm ? (
            <button className="btn-primary" onClick={() => setShowApplicationForm(true)}>
              Apply Now
            </button>
          ) : (
            <form onSubmit={handleApply} className="application-form">
              <h3>Application Form</h3>
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  rows="6"
                />
              </div>
              <div className="button-group">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-prompt">
          <p>Please login to apply for this job</p>
          <a href="/login" className="btn-primary">
            Login
          </a>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
