import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../api/userService';
import '../styles/UserManagement.css';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const userData = await getUserById(id);
      setUser(userData);
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return <div className="error-message">User not found</div>;
  }

  return (
    <div className="user-detail">
      <div className="page-header">
        <h1>User Details</h1>
        <div className="action-buttons">
          <button className="back-btn" onClick={() => navigate('/users')}>Back to List</button>
          <button className="edit-btn" onClick={() => navigate(`/users/edit/${id}`)}>Edit User</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="user-detail-card">
        <div className="user-info">
          <div className="info-row">
            <label>Username:</label>
            <span>{user.username}</span> {/* FIXED */}
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <label>Role:</label>
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          </div>
          <div className="info-row">
            <label>User ID:</label>
            <span>{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
