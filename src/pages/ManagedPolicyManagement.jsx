import { useEffect, useState } from "react";
import {
  getManagedPolicies,
  deleteManagedPolicy,
} from "../api/managedPolicyService";
import { getAllUsers } from "../api/userService";
import ManagedPolicyList from "../components/ManagedPolicyList";
import "../styles/ManagedPolicyManagement.css";

const ManagedPolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Fetch policies whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchPolicies(currentUser.role, currentUser.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchPolicies = async (role, username) => {
    try {
      setLoading(true);
      const data = await getManagedPolicies(role, username);
      setPolicies(data);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError("Failed to load managed policies.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteManagedPolicy(id);
      if (currentUser) {
        fetchPolicies(currentUser.role, currentUser.username);
      }
    } catch (err) {
      console.error("Error deleting managed policy:", err);
      setError("Failed to delete managed policy.");
    }
  };

  return (
    <div className="policy-management">
      <h1>Managed Policies</h1>

      {/* 🔹 User Selector */}
      <div className="form-group">
        <label htmlFor="userSelect">Select User: </label>
        <select
          id="userSelect"
          onChange={(e) => {
            const selected = users.find((u) => u.id === Number(e.target.value));
            setCurrentUser(selected || null);
          }}
        >
          <option value="">-- Choose a user --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.role})
            </option>
          ))}
        </select>
      </div>

      {currentUser && (
        <p>
          Viewing as <strong>{currentUser.username}</strong> ({currentUser.role})
        </p>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading policies...</div>}

      {!loading && currentUser && (
        <ManagedPolicyList policies={policies} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ManagedPolicyManagement;
