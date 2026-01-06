import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationService, jobService } from '../services/api';
import '../styles/Applications.css';

function EmployerJobApplications() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingAppId, setRatingAppId] = useState(null);
  const [rating, setRating] = useState(null);
  const [ratingComment, setRatingComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          jobService.getJob(jobId),
          applicationService.getJobApplications(jobId),
        ]);
        setJob(jobRes.data.job);
        setApplications(appsRes.data.applications);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const handleRateApplicant = async (appId) => {
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.rateApplicant(appId, rating, ratingComment);
      setRatingAppId(null);
      setRating(null);
      setRatingComment('');
      // Reload applications
      const appsRes = await applicationService.getJobApplications(jobId);
      setApplications(appsRes.data.applications);
      alert('Rating submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="applications-container">
      <h1>Applications for: {job?.title}</h1>
      <p className="location">📍 {job?.location}</p>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <div>
                  <h3>{app.userId?.name}</h3>
                  <p className="company">{app.userId?.location}</p>
                  <p className="location">{app.userId?.email}</p>
                </div>
                <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span>
              </div>

              <div className="candidate-meta">
                {app.userId?.resume && (
                  <a className="link-inline" href={app.userId.resume} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                )}
                {app.userId?.linkedinUrl && (
                  <a className="link-inline" href={app.userId.linkedinUrl} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
                {app.userId?.portfolioUrl && (
                  <a className="link-inline" href={app.userId.portfolioUrl} target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                )}
              </div>

              {app.coverLetter && (
                <div className="cover-letter">
                  <strong>Cover Letter:</strong>
                  <p>{app.coverLetter}</p>
                </div>
              )}

              {app.rating && (
                <div className="rating-display">
                  <strong>Rating:</strong> {'⭐'.repeat(app.rating)} ({app.rating}/5)
                  {app.ratingComment && <p>{app.ratingComment}</p>}
                </div>
              )}

              {!app.rating && ratingAppId === app._id ? (
                <div className="rating-form">
                  <div className="form-group">
                    <label>Rate this applicant:</label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`star ${rating >= star ? 'active' : ''}`}
                          onClick={() => setRating(star)}
                          type="button"
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Add a comment (optional)"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows="2"
                    />
                  </div>
                  <div className="button-group">
                    <button
                      className="btn-primary"
                      onClick={() => handleRateApplicant(app._id)}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setRatingAppId(null);
                        setRating(null);
                        setRatingComment('');
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                !app.rating && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setRatingAppId(app._id);
                      setRating(null);
                      setRatingComment('');
                    }}
                  >
                    Rate Applicant
                  </button>
                )
              )}

              <div className="button-group">
                <Link className="btn-secondary" to={`/candidate/${app.userId?._id}`}>
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerJobApplications;
