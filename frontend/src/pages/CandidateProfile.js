import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/Profile.css';

function CandidateProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getUserById(id);
        setProfile(res.data.user);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="error-message">Profile not found</div>;

  return (
    <div className="profile-container">
      <h1>Candidate Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-preview">
            <img
              src={profile.profilePhoto || 'https://via.placeholder.com/96'}
              alt={profile.name}
            />
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.location}</p>
            <p>{profile.email}</p>
            {profile.phone && <p>{profile.phone}</p>}
          </div>
        </div>

        <div className="profile-details">
          {profile.resume && (
            <p>
              <strong>Resume:</strong>{' '}
              <a className="link-inline" href={profile.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </p>
          )}
          {profile.linkedinUrl && (
            <p>
              <strong>LinkedIn:</strong>{' '}
              <a className="link-inline" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                {profile.linkedinUrl}
              </a>
            </p>
          )}
          {profile.portfolioUrl && (
            <p>
              <strong>Portfolio:</strong>{' '}
              <a className="link-inline" href={profile.portfolioUrl} target="_blank" rel="noreferrer">
                {profile.portfolioUrl}
              </a>
            </p>
          )}
          {profile.userType === 'employer' && profile.companyDescription && (
            <p>
              <strong>Company:</strong> {profile.companyName || 'N/A'}
            </p>
          )}
          {profile.userType === 'employer' && profile.companyDescription && (
            <p>
              <strong>About:</strong> {profile.companyDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;
