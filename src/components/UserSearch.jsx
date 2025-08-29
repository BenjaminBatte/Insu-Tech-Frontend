import React, { useState } from 'react';
import '../styles/UserManagement.css';

const UserSearch = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <div className="user-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
        <button type="button" onClick={handleClear} className="clear-search-btn">
          Clear
        </button>
      </form>
    </div>
  );
};

export default UserSearch;