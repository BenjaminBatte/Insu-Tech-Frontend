import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { createUser } from '../api/userService';

const CreateUser = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData);
      navigate('/users', { state: { message: 'User created successfully!' } });
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="create-user-page">
      {error && <div className="error-message">{error}</div>}
      <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateUser;