import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPolicy, updatePolicy, getPolicyById } from "../api/policyService"; // ✅ Import correctly
import "../styles/CreatePolicyPage.css";

const CreatePolicyPage = () => {
  const { policyId } = useParams(); // Check if updating an existing policy
  const navigate = useNavigate();

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

  useEffect(() => {
    if (policyId) {
      setIsEditing(true);
      fetchPolicyDetails(policyId);
    }
  }, [policyId]);

  const fetchPolicyDetails = async (id) => {
    try {
      const data = await getPolicyById(id);
      if (data) {
        setPolicy(data);
      }
    } catch (error) {
      console.error("Failed to fetch policy details:", error);
    }
  };

  const handleChange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePolicy(policyId, policy);
        alert("Policy updated successfully!");
      } else {
        await createPolicy(policy);
        alert("Policy created successfully!");
      }
      navigate("/policies");
    } catch (error) {
      console.error("Error saving policy:", error);
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
          <input type="text" id="policyNumber" name="policyNumber" value={policy.policyNumber} onChange={handleChange} required />

          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" value={policy.firstName} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" value={policy.lastName} onChange={handleChange} required />

          <label htmlFor="vehicleMake">Vehicle Make:</label>
          <input type="text" id="vehicleMake" name="vehicleMake" value={policy.vehicleMake} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="vehicleModel">Vehicle Model:</label>
          <input type="text" id="vehicleModel" name="vehicleModel" value={policy.vehicleModel} onChange={handleChange} required />

          <label htmlFor="vehicleYear">Vehicle Year:</label>
          <input type="number" id="vehicleYear" name="vehicleYear" value={policy.vehicleYear} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="policyType">Policy Type:</label>
          <input type="text" id="policyType" name="policyType" value={policy.policyType} onChange={handleChange} required />

          <label htmlFor="status">Status:</label>
          <input type="text" id="status" name="status" value={policy.status} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="premiumAmount">Premium Amount:</label>
          <input type="number" id="premiumAmount" name="premiumAmount" value={policy.premiumAmount} onChange={handleChange} required />

          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" value={policy.startDate} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" value={policy.endDate} onChange={handleChange} required />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">{isEditing ? "Update Policy" : "Create Policy"}</button>
          <button type="button" className="clear-button" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePolicyPage;
