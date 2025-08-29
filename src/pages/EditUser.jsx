import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { getUserById, updateUser } from '../api/userService';

const EditUser = () => {
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
      setError('Failed to load user data. Please try again.');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (userData) => {
    try {
      await updateUser(id, userData);
      navigate('/users', { state: { message: 'User updated successfully!' } });
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="edit-user-page">
      {error && <div className="error-message">{error}</div>}
      <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default EditUser;