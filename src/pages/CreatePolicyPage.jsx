import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createPolicy, updatePolicy, getPolicyById } from "../api/policyService";
import "../styles/CreatePolicyPage.css";

const CreatePolicyPage = () => {
  const { policyId } = useParams();
  const syncRef = useRef(null);

  const [policy, setPolicy] = useState({
    policyNumber: "",
    firstName: "",
    lastName: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    policyType: "",
    status: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (policyId) {
      setIsEditing(true);
      fetchPolicyDetails(policyId);
    }
  }, [policyId]);

  const fetchPolicyDetails = async (id) => {
    try {
      const data = await getPolicyById(id);
      if (data) setPolicy(data);
    } catch (err) {
      console.error("Failed to fetch policy details:", err);
    }
  };

  useEffect(() => {
    // Sync state with DOM values for Selenium automation
    syncRef.current = setInterval(() => {
      const startDateInput = document.getElementById('startDate');
      const endDateInput = document.getElementById('endDate');
      
      if (startDateInput && startDateInput.value !== policy.startDate) {
        setPolicy(prev => ({ ...prev, startDate: startDateInput.value }));
      }
      
      if (endDateInput && endDateInput.value !== policy.endDate) {
        setPolicy(prev => ({ ...prev, endDate: endDateInput.value }));
      }
    }, 100);

    return () => {
      if (syncRef.current) {
        clearInterval(syncRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setPolicy({
      ...policy,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(policy.startDate) >= new Date(policy.endDate)) {
      setError("End date must be after start date.");
      return;
    }
    
    try {
      if (isEditing) {
        await updatePolicy(policyId, policy);
      } else {
        await createPolicy(policy);
      }
      setSuccess(true);
      setError("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving policy:", err);
      setError("Failed to save policy: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setPolicy({
      policyNumber: "",
      firstName: "",
      lastName: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      policyType: "",
      status: "",
      premiumAmount: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="create-policy-container">
      <h2>{isEditing ? "Update Policy" : "Create New Policy"}</h2>
      <form onSubmit={handleSubmit} className="policy-form">
        <div className="form-row">
          <label htmlFor="policyNumber">Policy Number:</label>
          <input
            type="text"
            id="policyNumber"
            name="policyNumber"
            value={policy.policyNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={policy.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={policy.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="vehicleMake">Vehicle Make:</label>
          <input
            type="text"
            id="vehicleMake"
            name="vehicleMake"
            value={policy.vehicleMake}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="vehicleModel">Vehicle Model:</label>
          <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            value={policy.vehicleModel}
            onChange={handleChange}
            required
          />

          <label htmlFor="vehicleYear">Vehicle Year:</label>
          <input
            type="number"
            id="vehicleYear"
            name="vehicleYear"
            value={policy.vehicleYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="policyType">Policy Type:</label>
          <select
            id="policyType"
            name="policyType"
            value={policy.policyType}
            onChange={handleChange}
            required
          >
            <option value="">Select Policy Type</option>
            <option value="LIABILITY">LIABILITY</option>
            <option value="COLLISION">COLLISION</option>
            <option value="COMPREHENSIVE">COMPREHENSIVE</option>
          </select>

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={policy.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="premiumAmount">Premium Amount:</label>
          <input
            type="number"
            id="premiumAmount"
            name="premiumAmount"
            value={policy.premiumAmount}
            onChange={handleChange}
            required
          />

          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={policy.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={policy.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">
            {isEditing ? "Update Policy" : "Create Policy"}
          </button>
          <button type="button" className="clear-button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {success && (
        <p className="success-message" data-testid="success-message">
          {isEditing
            ? "Policy updated successfully!"
            : "Policy created successfully!"}
        </p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreatePolicyPage;