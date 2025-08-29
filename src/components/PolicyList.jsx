import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/PolicyListPage.css";

const PolicyList = ({ policies }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedPolicies, setSortedPolicies] = useState(policies);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...policies].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      if (!isNaN(valueA) && !isNaN(valueB)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else {
        valueA = valueA?.toString().toLowerCase();
        valueB = valueB?.toString().toLowerCase();
      }

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setSortedPolicies(sorted);
  };

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
                {label}{" "}
                {sortField === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPolicies.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No policies found.
              </td>
            </tr>
          ) : (
            sortedPolicies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.id}</td>
                <td>{policy.policyNumber}</td>
                <td>{policy.status}</td>
                <td>{policy.policyType}</td>
                <td>
                  {policy.vehicleMake} {policy.vehicleModel} (
                  {policy.vehicleYear})
                </td>
                <td>
                  {policy.firstName} {policy.lastName}
                </td>
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

PolicyList.propTypes = {
  policies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      policyNumber: PropTypes.string,
      status: PropTypes.string,
      policyType: PropTypes.string,
      vehicleMake: PropTypes.string,
      vehicleModel: PropTypes.string,
      vehicleYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      premiumAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default PolicyList;
