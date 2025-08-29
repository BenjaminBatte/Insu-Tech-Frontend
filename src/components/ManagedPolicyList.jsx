import PropTypes from "prop-types";
import "../styles/ManagedPolicyList.css";

const ManagedPolicyList = ({ policies, onDelete }) => {
  if (!policies || policies.length === 0) {
    return <div className="no-policies">No managed policies found</div>;
  }

  return (
    <div className="policy-list">
      <table>
        <thead>
          <tr>
            <th>Policy Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p) => (
            <tr key={p.id}>
              <td>{p.policyNumber}</td>
              <td>{p.type}</td>
              <td>{p.status}</td>
              <td>{p.assignedTo}</td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


ManagedPolicyList.propTypes = {
  policies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      policyNumber: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ManagedPolicyList;
