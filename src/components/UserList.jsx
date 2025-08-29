import PropTypes from "prop-types";
import "../styles/UserList.css";

const UserList = ({ users, onEdit, onDelete, onView }) => {
  if (!users || users.length === 0) {
    return <div className="no-users">No users found</div>;
  }

  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="view-btn" onClick={() => onView(user.id)}>View</button>
                  <button className="edit-btn" onClick={() => onEdit(user.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ✅ Add prop validation
UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default UserList;
