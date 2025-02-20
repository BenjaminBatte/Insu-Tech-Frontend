import { useState, useEffect } from "react";
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
    policyNumber: "",
  });

  const [policyId, setPolicyId] = useState("");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const policyStatuses = ["ACTIVE", "EXPIRED", "CANCELLED"];
  const policyTypes = ["LIABILITY", "COLLISION", "COMPREHENSIVE"];


  useEffect(() => {
    if (policyId || filters.policyNumber) {
      handleSearch();
    }
  }, []); 

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleIdChange = (e) => setPolicyId(e.target.value);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
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

      if (!data || data.length === 0) setError("No policies found.");
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError("Failed to fetch policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await deletePolicy(id);
      setPolicies((prevPolicies) => prevPolicies.filter((policy) => policy.id !== id));
      alert("Policy deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete policy.");
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    setPolicies((prevPolicies) =>
      [...prevPolicies].sort((a, b) => {
        if (typeof a[field] === "string") return a[field].localeCompare(b[field]) * (order === "asc" ? 1 : -1);
        return (a[field] - b[field]) * (order === "asc" ? 1 : -1);
      })
    );
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
      policyNumber: "",
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

        {["startDate", "endDate", "vehicleMake", "minPremium", "maxPremium", "firstName", "lastName"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1")}:</label>
            <input type={field.includes("Date") ? "date" : field.includes("Premium") ? "number" : "text"} name={field} value={filters[field]} onChange={handleChange} />
          </div>
        ))}

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

        <div className="button-group">
          <button type="submit" className="search-btn" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {policies.length > 0 && (
        <table className="policy-table">
          <thead>
            <tr>
              {["id", "policyNumber", "status", "policyType", "vehicleMake", "firstName", "startDate", "endDate", "premiumAmount"].map((field) => (
                <th key={field} onClick={() => handleSort(field)} className={sortField === field ? "active-sort" : ""}>
                  {field.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
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
                <td>{policy.vehicleMake} ({policy.vehicleYear})</td>
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
