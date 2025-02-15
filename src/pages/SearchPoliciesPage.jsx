import { useState } from "react";
import { getFilteredPolicies, getPolicyById, getPolicyByPolicyNumber, deletePolicy } from "../api/policyService";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPoliciesPage.css";

const SearchPoliciesPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    type: "",
    vehicleMake: "",
    minPremium: "",
    maxPremium: "",
    firstName: "",
    lastName: "",
    policyNumber: "",  // Added policy number filter
  });

  const [policyId, setPolicyId] = useState("");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const policyStatuses = ["ACT", "EXP", "CAN"];
  const policyTypes = ["LIAB", "COMP", "COLL"];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleIdChange = (e) => {
    setPolicyId(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPolicies([]);

    try {
      let data = [];

      if (policyId) {
        data = await getPolicyById(policyId);
        setPolicies(data ? [data] : []);
      } else if (filters.policyNumber) {
        data = await getPolicyByPolicyNumber(filters.policyNumber);
        setPolicies(data ? [data] : []);
      } else {
        data = await getFilteredPolicies(filters);
        setPolicies(Array.isArray(data) ? data : []);
      }

      if (!data || data.length === 0) {
        setError("No policies found.");
      }
    } catch (error) {
      setError("Failed to fetch policies.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deletePolicy(id);
        setPolicies(policies.filter((policy) => policy.id !== id));
        alert("Policy deleted successfully!");
      } catch (error) {
        alert("Failed to delete policy.");
      }
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedPolicies = [...policies].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setPolicies(sortedPolicies);
  };

  const handleClear = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      type: "",
      vehicleMake: "",
      minPremium: "",
      maxPremium: "",
      firstName: "",
      lastName: "",
      policyNumber: "",  // Reset policy number filter
    });
    setPolicyId("");
    setPolicies([]);
    setError("");
  };

  return (
    <div className="search-container">
      <h2>Search Policies</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label>Search by Policy ID:</label>
          <input type="text" name="policyId" value={policyId} onChange={handleIdChange} placeholder="Enter Policy ID (e.g., 101)" />
        </div>

        <div className="form-group">
          <label>Search by Policy Number:</label>
          <input type="text" name="policyNumber" value={filters.policyNumber} onChange={handleChange} placeholder="Enter Policy Number (e.g., AP-100)" />
        </div>

        <hr />

        <div className="form-group">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Policy Status:</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All</option>
            {policyStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Policy Type:</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All</option>
            {policyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Vehicle Make:</label>
          <input type="text" name="vehicleMake" value={filters.vehicleMake} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Min Premium:</label>
          <input type="number" name="minPremium" value={filters.minPremium} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Max Premium:</label>
          <input type="number" name="maxPremium" value={filters.maxPremium} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={filters.firstName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={filters.lastName} onChange={handleChange} />
        </div>

        <div className="button-group">
          <button type="submit" className="search-btn">Search</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </form>

      {loading && <p>Loading policies...</p>}
      {error && <p className="error">{error}</p>}

      {policies.length > 0 && (
        <table className="policy-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>ID</th>
              <th onClick={() => handleSort("policyNumber")}>Policy Number</th>
              <th onClick={() => handleSort("status")}>Status</th>
              <th onClick={() => handleSort("policyType")}>Type</th>
              <th onClick={() => handleSort("vehicleMake")}>Vehicle</th>
              <th onClick={() => handleSort("firstName")}>Owner</th>
              <th onClick={() => handleSort("startDate")}>Start Date</th>
              <th onClick={() => handleSort("endDate")}>End Date</th>
              <th onClick={() => handleSort("premiumAmount")}>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.id}</td>
                <td>{policy.policyNumber}</td>
                <td>{policy.status}</td>
                <td>{policy.policyType}</td>
                <td>{policy.vehicleMake} {policy.vehicleModel} ({policy.vehicleYear})</td>
                <td>{policy.firstName} {policy.lastName}</td>
                <td>{policy.startDate}</td>
                <td>{policy.endDate}</td>
                <td>${policy.premiumAmount}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/edit/${policy.id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(policy.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchPoliciesPage;
