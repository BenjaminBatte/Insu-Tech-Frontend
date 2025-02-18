import React, { useEffect, useState } from "react";
import { getAllPolicies } from "../api/policyService";
import PolicyList from "../components/PolicyList";
import "../styles/PolicyListPage.css";

const PolicyListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getAllPolicies();
        setPolicies(data);
      } catch (error) {
        setError("Failed to fetch policies.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div className="policy-list-container">
      <h2>All Policies</h2>
      {loading && (
        <p className="loading">
          <span className="spinner">🌀</span> Loading policies...
        </p>
      )}
      {error && <p className="error">{error}</p>}

     
      {!loading && !error && <PolicyList policies={policies} />}
    </div>
  );
};

export default PolicyListPage;