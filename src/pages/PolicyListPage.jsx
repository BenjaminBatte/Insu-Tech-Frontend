import { useEffect, useState } from "react";
import { 
  getAllPolicies, 
  getAllPoliciesFresh, 
  setupCacheListener,
  invalidatePolicyCaches 
} from "../api/policyService";
import PolicyList from "../components/PolicyList";
import "../styles/PolicyListPage.css";

const PolicyListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPolicies = async (forceRefresh = false) => {
    const isRefreshing = forceRefresh && !loading;
    
    if (isRefreshing) {
      setRefreshing(true);
    } else if (!loading) {
      setLoading(true);
    }
    
    setError("");
    
    try {
      const data = forceRefresh 
        ? await getAllPoliciesFresh()
        : await getAllPolicies();
      
      setPolicies(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      setError("Failed to fetch policies. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPolicies(true);
  };

  const handleManualInvalidate = () => {
    invalidatePolicyCaches();
    // Optionally refresh data immediately after manual invalidation
    fetchPolicies(true);
  };

  useEffect(() => {
    // Initial fetch
    fetchPolicies();

    // Setup cache invalidation listener
    const cleanup = setupCacheListener((eventDetail) => {
      console.log('Cache invalidated, refreshing data...', eventDetail);
      // Refresh data when cache is invalidated from other parts of the app
      fetchPolicies(true);
    });

    return cleanup;
  }, []);

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="policy-list-container">
      <div className="page-header">
        <h2>All Policies</h2>
        <div className="header-controls">
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="refresh-btn"
            title="Force refresh with fresh data"
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <button 
            onClick={handleManualInvalidate}
            className="invalidate-btn"
            title="Invalidate all caches"
          >
            🗑️ Invalidate Cache
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {formatTime(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {loading && !refreshing && (
        <div className="loading-state">
          <span className="spinner">🌀</span> 
          <p>Loading policies...</p>
        </div>
      )}

      {refreshing && (
        <div className="refreshing-state">
          <span className="spinner">🔄</span> 
          <p>Refreshing data...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && policies.length === 0 && (
        <div className="empty-state">
          <p>No policies found.</p>
          <button onClick={handleRefresh} className="retry-btn">
            Check Again
          </button>
        </div>
      )}

      {!loading && !error && policies.length > 0 && (
        <>
          <div className="policies-summary">
            <p>Showing {policies.length} policy{policies.length !== 1 ? 's' : ''}</p>
          </div>
          <PolicyList policies={policies} />
        </>
      )}
    </div>
  );
};

export default PolicyListPage;