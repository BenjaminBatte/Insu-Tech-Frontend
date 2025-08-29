import { useState, useEffect } from "react";
import { 
  getFilteredPolicies, 
  getFilteredPoliciesFresh,
  getPolicyById, 
  getPolicyByIdFresh,
  getPolicyByPolicyNumber, 
  getPolicyByPolicyNumberFresh,
  deletePolicy,
  setupCacheListener,
  invalidatePolicyCaches
} from "../api/policyService";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [lastUpdated, setLastUpdated] = useState(null);

  const policyStatuses = ["ACTIVE", "EXPIRED", "CANCELLED"];
  const policyTypes = ["LIABILITY", "COLLISION", "COMPREHENSIVE"];

  useEffect(() => {
    // Setup cache invalidation listener
    const cleanup = setupCacheListener(() => {
      console.log('Cache invalidated in SearchPoliciesPage');
      // If we have active search results, refresh them
      if (policies.length > 0) {
        handleRefresh();
      }
    });

    return cleanup;
  }, [policies.length]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleIdChange = (e) => setPolicyId(e.target.value);

  const handleSearch = async (e, forceRefresh = false) => {
    if (e) e.preventDefault();
    
    const isRefreshing = forceRefresh && policies.length > 0;
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError("");
    
    if (!forceRefresh) {
      setPolicies([]);
    }

    try {
      let data = [];

      if (policyId) {
        data = forceRefresh 
          ? await getPolicyByIdFresh(policyId)
          : await getPolicyById(policyId);
        setPolicies(data ? [data] : []);
      } else if (filters.policyNumber) {
        data = forceRefresh 
          ? await getPolicyByPolicyNumberFresh(filters.policyNumber)
          : await getPolicyByPolicyNumber(filters.policyNumber);
        setPolicies(data ? [data] : []);
      } else {
        data = forceRefresh 
          ? await getFilteredPoliciesFresh(filters)
          : await getFilteredPolicies(filters);
        setPolicies(Array.isArray(data) ? data : []);
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError("No policies found.");
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError("Failed to fetch policies. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    handleSearch(null, true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await deletePolicy(id);
      setPolicies((prevPolicies) => prevPolicies.filter((policy) => policy.id !== id));
      alert("Policy deleted successfully!");
      
      // Invalidate caches after deletion
      invalidatePolicyCaches();
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
        if (a[field] === null || b[field] === null) return 0;
        if (typeof a[field] === "string") {
          return a[field].localeCompare(b[field]) * (order === "asc" ? 1 : -1);
        }
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
    setLastUpdated(null);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  return (
    <div className="search-container">
      <div className="page-header">
        <h2>Search Policies</h2>
        {lastUpdated && policies.length > 0 && (
          <div className="header-controls">
            <button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="refresh-btn"
              title="Refresh with fresh data"
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
            <span className="last-updated">
              Last updated: {formatTime(lastUpdated)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => handleSearch(e, false)} className="search-form">
        <div className="form-group">
          <label>Search by Policy ID:</label>
          <input 
            type="text" 
            name="policyId" 
            value={policyId} 
            onChange={handleIdChange} 
            placeholder="Enter Policy ID (e.g., 101)" 
          />
        </div>

        <div className="form-group">
          <label>Search by Policy Number:</label>
          <input 
            type="text" 
            name="policyNumber" 
            value={filters.policyNumber} 
            onChange={handleChange} 
            placeholder="Enter Policy Number (e.g., AP-100)" 
          />
        </div>

        <hr />

        {["startDate", "endDate", "vehicleMake", "minPremium", "maxPremium", "firstName", "lastName"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1").trim()}:</label>
            <input 
              type={field.includes("Date") ? "date" : field.includes("Premium") ? "number" : "text"} 
              name={field} 
              value={filters[field]} 
              onChange={handleChange} 
              placeholder={field.includes("Premium") ? "0.00" : ""}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Policy Status:</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All Statuses</option>
            {policyStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Policy Type:</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All Types</option>
            {policyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="search-btn" 
            disabled={loading || refreshing}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button 
            type="button" 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={policies.length === 0 || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          <button 
            type="button" 
            className="clear-btn" 
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => handleSearch(null, true)} className="retry-btn">
            Try Again with Fresh Data
          </button>
        </div>
      )}

      {refreshing && policies.length > 0 && (
        <div className="refreshing-indicator">
          <span className="spinner">🔄</span> Refreshing data...
        </div>
      )}

      {policies.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h3>Search Results ({policies.length} policy{policies.length !== 1 ? 's' : ''})</h3>
          </div>
          
          <table className="policy-table">
            <thead>
              <tr>
                {["id", "policyNumber", "status", "policyType", "vehicleMake", "firstName", "startDate", "endDate", "premiumAmount"].map((field) => (
                  <th 
                    key={field} 
                    onClick={() => handleSort(field)} 
                    className={sortField === field ? `active-sort sort-${sortOrder}` : ""}
                  >
                    {field.replace(/([A-Z])/g, " $1").trim()}
                    {sortField === field && (
                      <span className="sort-indicator">
                        {sortOrder === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
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
                  <td>
                    <span className={`status-badge status-${policy.status?.toLowerCase()}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td>{policy.policyType}</td>
                  <td>{policy.vehicleMake} {policy.vehicleYear && `(${policy.vehicleYear})`}</td>
                  <td>{policy.firstName} {policy.lastName}</td>
                  <td>{policy.startDate}</td>
                  <td>{policy.endDate}</td>
                  <td>${policy.premiumAmount}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => navigate(`/edit/${policy.id}`)}
                        title="Edit Policy"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(policy.id)}
                        title="Delete Policy"
                      >
                        🗑️
                      </button>
                      <button 
                        className="view-btn" 
                        onClick={() => navigate(`/policy/${policy.id}`)}
                        title="View Details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchPoliciesPage;