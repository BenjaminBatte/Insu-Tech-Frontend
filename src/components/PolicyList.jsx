import React, { useState } from "react";
import "../styles/PolicyListPage.css";

const PolicyList = ({ policies }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    let newSortOrder = "asc";
    if (sortField === field && sortOrder === "asc") {
      newSortOrder = "desc"; 
    }

    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedPolicies = [...policies].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

    
      if (!isNaN(valueA) && !isNaN(valueB)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else {
        valueA = valueA?.toString().toLowerCase();
        valueB = valueB?.toString().toLowerCase();
      }

      if (valueA < valueB) return newSortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setSortedPolicies(sortedPolicies);
  };

  const [sortedPolicies, setSortedPolicies] = useState(policies);

  return (
    <div className="policy-list-container">
      <table className="policy-table">
        <thead>
          <tr>
            {[
              { label: "ID", field: "id" },
              { label: "Policy Number", field: "policyNumber" },
              { label: "Status", field: "status" },
              { label: "Type", field: "policyType" },
              { label: "Vehicle", field: "vehicleMake" },
              { label: "Owner", field: "firstName" },
              { label: "Start Date", field: "startDate" },
              { label: "End Date", field: "endDate" },
              { label: "Premium", field: "premiumAmount" },
            ].map(({ label, field }) => (
              <th key={field} onClick={() => handleSort(field)}>
                {label} {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPolicies.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>No policies found.</td>
            </tr>
          ) : (
            sortedPolicies.map((policy) => (
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyList;
