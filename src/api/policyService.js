const API_BASE_URL = "http://localhost:9090/api/v1/policies";

/**
 * Helper function to handle API responses
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

/**
 * Fetch all policies
 */
export const getAllPolicies = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
};

/**
 * Fetch a policy by ID
 */
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

/**
 * Fetch a policy by Policy Number
 */
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

/**
 * Fetch filtered policies
 */
export const getFilteredPolicies = async (filters) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    const response = await fetch(`${API_BASE_URL}/filter?${queryString}`);

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching filtered policies:", error);
    return [];
  }
};

/**
 * Create a new policy
 */
export const createPolicy = async (policyData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to create policy:", error);
    throw error;
  }
};

/**
 * Update an existing policy
 */
export const updatePolicy = async (policyId, policyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to update policy:", error);
    throw error;
  }
};

/**
 * Search handler for policies (Used in React components)
 */
export const handleSearch = async (e, policyId, policyNumber, filters, setLoading, setError, setPolicies) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setPolicies([]);

  try {
    let data = [];

    if (policyId) {
      data = await getPolicyById(policyId);
      setPolicies(data ? [data] : []);
    } else if (policyNumber) {
      data = await getPolicyByPolicyNumber(policyNumber);
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

/**
 * Delete a policy by ID
 */
export const deletePolicy = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting policy: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting policy:", error);
    throw error;
  }
};
