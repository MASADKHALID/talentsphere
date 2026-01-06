import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { applicationService } from '../services/api';
import '../styles/Applications.css';

function MyApplications() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.userType === 'job_seeker') {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getUserApplications();
      setApplications(response.data.applications);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationService.withdrawApplication(applicationId);
        setApplications(applications.filter((app) => app._id !== applicationId));
      } catch (err) {
        setError('Failed to withdraw application');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Reviewed':
        return 'status-reviewed';
      case 'Interview':
        return 'status-interview';
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="applications-container">
      <h1>My Applications</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <h3>{app.jobId?.title}</h3>
                <span className={`status ${getStatusColor(app.status)}`}>{app.status}</span>
              </div>
              <p className="company">{app.jobId?.company?.companyName}</p>
              <p className="location">📍 {app.jobId?.location}</p>
              <p className="applied-date">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
              {app.coverLetter && (
                <div className="cover-letter">
                  <strong>Cover Letter:</strong>
                  <p>{app.coverLetter}</p>
                </div>
              )}
              <button
                className="btn-danger"
                onClick={() => handleWithdraw(app._id)}
              >
                Withdraw
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
