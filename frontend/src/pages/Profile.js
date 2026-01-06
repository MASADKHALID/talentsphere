import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/Profile.css';

const normalizeUrl = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    resume: '',
    profilePhoto: '',
    linkedinUrl: '',
    portfolioUrl: '',
    companyDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        resume: user.resume || '',
        profilePhoto: user.profilePhoto || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        companyDescription: user.companyDescription || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile({
        ...formData,
        profilePhoto: normalizeUrl(formData.profilePhoto),
        resume: normalizeUrl(formData.resume),
        linkedinUrl: normalizeUrl(formData.linkedinUrl),
        portfolioUrl: normalizeUrl(formData.portfolioUrl),
      });

      const updatedUser = response.data.user;
      updateUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        phone: updatedUser.phone || '',
        location: updatedUser.location || '',
        resume: updatedUser.resume || '',
        profilePhoto: updatedUser.profilePhoto || '',
        linkedinUrl: updatedUser.linkedinUrl || '',
        portfolioUrl: updatedUser.portfolioUrl || '',
        companyDescription: updatedUser.companyDescription || '',
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePhoto">Profile Photo URL</label>
          <input
            type="url"
            id="profilePhoto"
            name="profilePhoto"
            value={formData.profilePhoto}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
          {formData.profilePhoto && (
            <div className="avatar-preview">
              <img src={formData.profilePhoto} alt="Profile preview" />
            </div>
          )}
        </div>

        {user?.userType === 'job_seeker' && (
          <>
            <div className="form-group">
              <label htmlFor="resume">Resume / CV URL</label>
              <input
                type="url"
                id="resume"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />
              {formData.resume && (
                <a className="link-inline" href={formData.resume} target="_blank" rel="noreferrer">
                  View Resume
                </a>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="linkedinUrl">LinkedIn URL</label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/your-profile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolioUrl">Portfolio URL</label>
              <input
                type="text"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://yourportfolio.com or masadkhalid.github.io/PORTFOLIO/"
              />
              {formData.portfolioUrl && (
                <a className="link-inline" href={formData.portfolioUrl} target="_blank" rel="noreferrer">
                  View Portfolio
                </a>
              )}
            </div>
          </>
        )}

        {user?.userType === 'employer' && (
          <div className="form-group">
            <label htmlFor="companyDescription">Company Description</label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              placeholder="Tell us about your company..."
              rows="5"
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
