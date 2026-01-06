import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notificationService } from '../services/api';
import '../styles/Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          💼 TalentSphere
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <span
                className={`user-badge ${user?.userType === 'employer' ? 'badge-employer' : 'badge-job-seeker'}`}
                title={user?.userType === 'employer' ? 'Employer' : 'Job Seeker'}
              >
                {user?.userType === 'employer' ? 'E' : 'JS'}
              </span>
              {/* Notifications Bell comes before Browse Jobs */}
              <div className="notification-container">
                <button
                  className="notification-bell"
                  onClick={() => setShowDropdown(!showDropdown)}
                  title="Notifications"
                >
                  🔔
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {showDropdown && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button className="btn-mark-all" onClick={() => notificationService.markAllAsRead().then(loadNotifications)}>
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <p className="no-notifications">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => markAsRead(notif._id)}
                          >
                            <p>{notif.message}</p>
                            <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/jobs" className="nav-link">
                Browse Jobs
              </Link>
              {user?.userType === 'job_seeker' && (
                <Link to="/applications" className="nav-link">
                  My Applications
                </Link>
              )}
              {user?.userType === 'employer' && (
                <Link to="/employer-dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}


              <Link to="/profile" className="nav-link">
                Profile
              </Link>


              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/jobs" className="nav-link">
                Browse Jobs
              </Link>
              <Link to="/login" className="btn-link">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>

            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
