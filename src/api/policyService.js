const API_BASE_URL = "http://localhost:9090/api/v1/policies";

// Cache invalidation event system
const CACHE_EVENTS = {
  POLICY_DATA_CHANGED: 'policyDataChanged'
};

// Dispatch cache invalidation event
const invalidateCaches = () => {
  window.dispatchEvent(new CustomEvent(CACHE_EVENTS.POLICY_DATA_CHANGED, {
    detail: { timestamp: Date.now() }
  }));
  console.log("Cache invalidation triggered");
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

export const getAllPolicies = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
};

// Fresh data fetch with cache busting
export const getAllPoliciesFresh = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?cacheBust=${Date.now()}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching fresh policies:", error);
    return [];
  }
};

export const getPolicyById = async (id) => {
  try {
    if (!id) return null;
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching policy by ID:", error);
    return null;
  }
};

// Fresh data fetch for single policy
export const getPolicyByIdFresh = async (id) => {
  try {
    if (!id) return null;
    const response = await fetch(`${API_BASE_URL}/${id}?cacheBust=${Date.now()}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching fresh policy by ID:", error);
    return null;
  }
};

export const getPolicyByPolicyNumber = async (policyNumber) => {
  try {
    if (!policyNumber) return null;
    const response = await fetch(`${API_BASE_URL}/policyNumber/${policyNumber}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching policy by Policy Number:", error);
    return null;
  }
};

// Fresh data fetch for policy number
export const getPolicyByPolicyNumberFresh = async (policyNumber) => {
  try {
    if (!policyNumber) return null;
    const response = await fetch(`${API_BASE_URL}/policyNumber/${policyNumber}?cacheBust=${Date.now()}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching fresh policy by Policy Number:", error);
    return null;
  }
};

export const getFilteredPolicies = async (filters) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );
    const queryString = new URLSearchParams(filteredParams).toString();
    const response = await fetch(`${API_BASE_URL}/filter?${queryString}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching filtered policies:", error);
    return [];
  }
};

// Fresh data fetch for filtered policies
export const getFilteredPoliciesFresh = async (filters) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );
    filteredParams.cacheBust = Date.now();
    const queryString = new URLSearchParams(filteredParams).toString();
    const response = await fetch(`${API_BASE_URL}/filter?${queryString}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching fresh filtered policies:", error);
    return [];
  }
};

export const createPolicy = async (policyData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyData),
    });
    const result = await handleResponse(response);
    
    // Invalidate caches after creating new policy
    invalidateCaches();
    
    return result;
  } catch (error) {
    console.error("Failed to create policy:", error);
    throw error;
  }
};

export const updatePolicy = async (policyId, policyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyData),
    });
    const result = await handleResponse(response);
    
    // Invalidate caches after updating policy
    invalidateCaches();
    
    return result;
  } catch (error) {
    console.error("Failed to update policy:", error);
    throw error;
  }
};

export const deletePolicy = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error deleting policy: ${response.status}`);
    }
    
    // Invalidate caches after deleting policy
    invalidateCaches();
    
    return true;
  } catch (error) {
    console.error("Error deleting policy:", error);
    throw error;
  }
};

// Manual cache invalidation function for external use
export const invalidatePolicyCaches = () => {
  invalidateCaches();
};

// Event listener setup helper for React components
export const setupCacheListener = (callback) => {
  const handleCacheInvalidation = (event) => {
    callback(event.detail);
  };
  
  window.addEventListener(CACHE_EVENTS.POLICY_DATA_CHANGED, handleCacheInvalidation);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(CACHE_EVENTS.POLICY_DATA_CHANGED, handleCacheInvalidation);
  };
};

// Utility function to check if we should force fresh data
export const shouldFetchFresh = (lastUpdated, cacheTimeout = 300000) => {
  // 5 minutes default cache timeout
  return !lastUpdated || (Date.now() - lastUpdated) > cacheTimeout;
};

// Export cache events for external use
export { CACHE_EVENTS };