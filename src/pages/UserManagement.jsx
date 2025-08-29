import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import UserSearch from '../components/UserSearch';
import { getAllUsers, deleteUser, searchUsers } from '../api/userService';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
      setFilteredUsers(userData);
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    try {
      setLoading(true);
      const results = await searchUsers(searchTerm);
      setFilteredUsers(results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFilteredUsers(users);
  };

  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // Refresh the user list
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="create-user-btn" onClick={handleCreateUser}>
          Create New User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <UserSearch onSearch={handleSearch} onClear={handleClearSearch} />

      <UserList
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />
    </div>
  );
};

export default UserManagement;