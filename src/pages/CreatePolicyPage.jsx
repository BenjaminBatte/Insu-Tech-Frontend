import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createPolicy, updatePolicy, getPolicyById } from "../api/policyService";
import { getAllUsers } from "../api/userService";
import "../styles/CreatePolicyPage.css";

const CreatePolicyPage = () => {
  const { policyId } = useParams();
  const syncRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [years, setYears] = useState([]); //  store years for dropdown

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
    userId: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Generate years list (1900 -> currentYear+1)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let y = currentYear + 1; y >= 1900; y--) {
      yearList.push(y);
    }
    setYears(yearList);
  }, []);

  // Load policy if editing
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

  // Load users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
        setGlobalError("Could not load users for assignment.");
      }
    };
    fetchUsers();
  }, []);

  // Selenium sync for dates
  useEffect(() => {
    syncRef.current = setInterval(() => {
      const startDateInput = document.getElementById("startDate");
      const endDateInput = document.getElementById("endDate");

      if (startDateInput && startDateInput.value !== policy.startDate) {
        setPolicy((prev) => ({ ...prev, startDate: startDateInput.value }));
      }

      if (endDateInput && endDateInput.value !== policy.endDate) {
        setPolicy((prev) => ({ ...prev, endDate: endDateInput.value }));
      }
    }, 100);

    return () => {
      if (syncRef.current) {
        clearInterval(syncRef.current);
      }
    };
  }, [policy.startDate, policy.endDate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setPolicy({
      ...policy,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });

    // clear error for that field
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(policy.startDate) >= new Date(policy.endDate)) {
      setFieldErrors((prev) => ({
        ...prev,
        endDate: "End date must be after start date.",
      }));
      return;
    }

    try {
      if (isEditing) {
        await updatePolicy(policyId, policy);
      } else {
        await createPolicy(policy);
      }
      setSuccess(true);
      setGlobalError("");
      setFieldErrors({});
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving policy:", err);
      const message = err.response?.data?.message || err.message;

      if (message.includes("Policy number already exists")) {
        setFieldErrors((prev) => ({
          ...prev,
          policyNumber:
            "This policy number already exists. Please choose another.",
        }));
      } else {
        setGlobalError("Failed to save policy: " + message);
      }
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
      userId: "",
    });
    setFieldErrors({});
    setGlobalError("");
  };

  return (
    <div className="create-policy-container">
      <h2>{isEditing ? "Update Policy" : "Create New Policy"}</h2>
      <form onSubmit={handleSubmit} className="policy-form">
        {/* Row 1 */}
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
          {fieldErrors.policyNumber && (
            <p className="field-error">{fieldErrors.policyNumber}</p>
          )}

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

        {/* Row 2 */}
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

        {/* Row 3 */}
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
          <select
            id="vehicleYear"
            name="vehicleYear"
            value={policy.vehicleYear}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Row 4 */}
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

        {/* Row 5 */}
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

          <label htmlFor="userId">Assign To User:</label>
          <select
            id="userId"
            name="userId"
            value={policy.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Row 6 */}
        <div className="form-row">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={policy.startDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={policy.endDate}
            onChange={handleChange}
            required
          />
          {fieldErrors.endDate && (
            <p className="field-error">{fieldErrors.endDate}</p>
          )}
        </div>

        {/* Buttons */}
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
      {globalError && <p className="error-message">{globalError}</p>}
    </div>
  );
};

export default CreatePolicyPage;
